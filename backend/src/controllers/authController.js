const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/app');
const logger = require('../utils/logger');

/**
 * Generar JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
};

/**
 * Generar Refresh Token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire
  });
};

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const user = await User.create({
      email,
      password,
      name,
      role: 'viewer' // Por defecto viewer
    });

    // Generar tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    logger.info(`Nuevo usuario registrado: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.error(`Error en registro: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Login de usuario
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await user.update({ lastLogin: new Date() });

    // Generar tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    logger.info(`Usuario logueado: ${email}`);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Obtener usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    logger.error(`Error al obtener usuario: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Logout de usuario
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    logger.info(`Usuario logout: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    logger.error(`Error en logout: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Refrescar token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(token, config.jwt.refreshSecret);

    // Generar nuevo token
    const newToken = generateToken(decoded.id);

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    logger.error(`Error al refrescar token: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Refresh token inválido o expirado'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  refreshToken
};