const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(protect);

// Validaciones
const userValidators = {
  create: [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    validate
  ],
  update: [
    body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
    body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    validate
  ],
  changePassword: [
    body('currentPassword').optional().notEmpty().withMessage('Contraseña actual requerida'),
    body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    validate
  ]
};

// Rutas de usuarios (solo admin)
router.get('/', authorize('admin'), getUsers);
router.post('/', authorize('admin'), userValidators.create, createUser);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), userValidators.update, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/password', userValidators.changePassword, changePassword);

module.exports = router;