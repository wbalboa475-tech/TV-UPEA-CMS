const { body, param, query, validationResult } = require('express-validator');

/**
 * Validar resultados de express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validaciones para autenticación
 */
const authValidators = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    validate
  ],
  
  login: [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida'),
    validate
  ]
};

/**
 * Validaciones para archivos
 */
const fileValidators = {
  upload: [
    body('folderId')
      .optional()
      .isUUID()
      .withMessage('ID de carpeta inválido'),
    validate
  ],
  
  update: [
    param('id')
      .isUUID()
      .withMessage('ID de archivo inválido'),
    body('originalName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),
    validate
  ]
};

/**
 * Validaciones para carpetas
 */
const folderValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('parentId')
      .optional()
      .isUUID()
      .withMessage('ID de carpeta padre inválido'),
    validate
  ],
  
  update: [
    param('id')
      .isUUID()
      .withMessage('ID de carpeta inválido'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),
    validate
  ]
};

module.exports = {
  validate,
  authValidators,
  fileValidators,
  folderValidators
};