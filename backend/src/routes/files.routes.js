const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  downloadFile
} = require('../controllers/fileController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { fileValidators } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de archivos
router.post('/upload', upload.single('file'), fileValidators.upload, uploadFile);
router.get('/', getFiles);
router.get('/:id', getFileById);
router.put('/:id', fileValidators.update, updateFile);
router.delete('/:id', deleteFile);
router.get('/:id/download', downloadFile);

module.exports = router;