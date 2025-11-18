const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/app');

/**
 * Verificar token JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si existe token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Obtener usuario del token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Agregar usuario a request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Verificar roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.role} no tiene permiso para acceder a este recurso`
      });
    }
    next();
  };
};

/**
 * Verificar si el usuario es dueño del recurso o admin
 */
const checkOwnership = (modelName, idParam = 'id', ownerField = 'uploadedBy') => {
  return async (req, res, next) => {
    try {
      // Admin puede hacer todo
      if (req.user.role === 'admin') {
        return next();
      }

      const model = require('../models')[modelName];
      const resource = await model.findByPk(req.params[idParam]);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }

      if (resource[ownerField] !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a este recurso'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos'
      });
    }
  };
};

module.exports = {
  protect,
  authorize,
  checkOwnership
};