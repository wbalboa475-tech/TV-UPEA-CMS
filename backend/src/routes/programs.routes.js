const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(protect);

// Validaciones
const programValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    validate
  ]
};

// Rutas
router.get('/', getPrograms);
router.get('/:id', getProgramById);
router.post('/', authorize('admin'), programValidators.create, createProgram);
router.put('/:id', authorize('admin'), updateProgram);
router.delete('/:id', authorize('admin'), deleteProgram);

module.exports = router;