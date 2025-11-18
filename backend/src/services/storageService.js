const { s3, BUCKET_NAME } = require('../config/storage');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Subir archivo a S3
 */
const uploadToS3 = async (filePath, fileName, mimeType) => {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: fileContent,
      ContentType: mimeType,
      ACL: 'private'
    };

    const result = await s3.upload(params).promise();
    
    // Eliminar archivo temporal
    fs.unlinkSync(filePath);
    
    logger.info(`Archivo subido a S3: ${fileName}`);
    return result.Location;
  } catch (error) {
    logger.error(`Error al subir archivo a S3: ${error.message}`);
    throw error;
  }
};

/**
 * Eliminar archivo de S3
 */
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extraer el key del URL
    const key = fileUrl.split('.com/')[1];

    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();
    logger.info(`Archivo eliminado de S3: ${key}`);
  } catch (error) {
    logger.error(`Error al eliminar archivo de S3: ${error.message}`);
    throw error;
  }
};

/**
 * Obtener URL firmada (temporal) para descarga
 */
const getSignedUrl = async (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    logger.error(`Error al generar URL firmada: ${error.message}`);
    throw error;
  }
};

/**
 * Copiar archivo en S3
 */
const copyInS3 = async (sourceKey, destinationKey) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey
    };

    await s3.copyObject(params).promise();
    logger.info(`Archivo copiado en S3: ${sourceKey} -> ${destinationKey}`);
  } catch (error) {
    logger.error(`Error al copiar archivo en S3: ${error.message}`);
    throw error;
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
  copyInS3
};