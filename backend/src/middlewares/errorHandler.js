const logger = require('../utils/logger');

/**
 * Middleware para manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  logger.error(err);

  // Error de Sequelize - Validación
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  // Error de Sequelize - Unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'El registro ya existe';
    error.message = message;
    error.statusCode = 400;
  }

  // Error de Sequelize - Foreign key
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Referencia inválida';
    error.message = message;
    error.statusCode = 400;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error.message = message;
    error.statusCode = 401;
  }

  // Error de Multer (upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'El archivo es demasiado grande';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error.message = 'Demasiados archivos';
    }
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;