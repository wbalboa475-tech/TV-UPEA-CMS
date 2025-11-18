const crypto = require('crypto');

/**
 * Generar nombre único para archivo
 */
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
};

/**
 * Formatear tamaño de archivo
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validar tipo de archivo
 */
const isValidFileType = (mimeType, allowedTypes) => {
  if (!allowedTypes || allowedTypes.length === 0) return true;
  
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      // Comparar categoría (ej: video/*, image/*)
      const category = type.split('/')[0];
      return mimeType.startsWith(category);
    }
    return mimeType === type;
  });
};

/**
 * Generar slug desde texto
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * Sanitizar nombre de archivo
 */
const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_');
};

module.exports = {
  generateUniqueFileName,
  formatFileSize,
  isValidFileType,
  generateSlug,
  sanitizeFileName
};