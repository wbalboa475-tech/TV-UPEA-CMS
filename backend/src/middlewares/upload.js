const multer = require('multer');
const path = require('path');
const { generateUniqueFileName, isValidFileType } = require('../utils/helpers');
const config = require('../config/app');

// Configurar almacenamiento temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFileName(file.originalname);
    cb(null, uniqueName);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.upload.allowedTypes;
  
  if (allowedTypes.length === 0 || isValidFileType(file.mimetype, allowedTypes)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: fileFilter
});

module.exports = upload;