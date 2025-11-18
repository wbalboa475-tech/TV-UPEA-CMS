const express = require('express');
const router = express.Router();
const {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder
} = require('../controllers/folderController');
const { protect } = require('../middlewares/auth');
const { folderValidators } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de carpetas
router.post('/', folderValidators.create, createFolder);
router.get('/', getFolders);
router.get('/:id', getFolderById);
router.put('/:id', folderValidators.update, updateFolder);
router.delete('/:id', deleteFolder);

module.exports = router;