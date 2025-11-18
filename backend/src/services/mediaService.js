const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Configurar rutas de ffmpeg y ffprobe para Windows
if (process.platform === 'win32') {
  const ffmpegPath = 'C:\\ffmpeg\\ffmpeg-master-latest-win64-gpl\\bin\\ffmpeg.exe';
  const ffprobePath = 'C:\\ffmpeg\\ffmpeg-master-latest-win64-gpl\\bin\\ffprobe.exe';
  
  if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  if (fs.existsSync(ffprobePath)) {
    ffmpeg.setFfprobePath(ffprobePath);
  }
}

/**
 * Obtener metadata de video
 */
const getVideoMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        logger.error(`Error al obtener metadata de video: ${err.message}`);
        reject(err);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        resolve({
          duration: Math.round(metadata.format.duration),
          resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : null,
          codec: videoStream ? videoStream.codec_name : null,
          bitrate: metadata.format.bit_rate,
          size: metadata.format.size
        });
      }
    });
  });
};

/**
 * Generar thumbnail de video
 */
const generateVideoThumbnail = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:02'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x240'
      })
      .on('end', () => {
        logger.info(`Thumbnail generado: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        logger.error(`Error al generar thumbnail: ${err.message}`);
        reject(err);
      });
  });
};

/**
 * Generar thumbnail de imagen
 */
const generateImageThumbnail = async (imagePath, outputPath, width = 320, height = 240) => {
  try {
    await sharp(imagePath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);
    
    logger.info(`Thumbnail de imagen generado: ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error(`Error al generar thumbnail de imagen: ${error.message}`);
    throw error;
  }
};

/**
 * Comprimir imagen
 */
const compressImage = async (imagePath, outputPath, quality = 80) => {
  try {
    const extension = path.extname(imagePath).toLowerCase();
    
    let pipeline = sharp(imagePath);
    
    if (extension === '.jpg' || extension === '.jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (extension === '.png') {
      pipeline = pipeline.png({ quality });
    } else if (extension === '.webp') {
      pipeline = pipeline.webp({ quality });
    }
    
    await pipeline.toFile(outputPath);
    
    logger.info(`Imagen comprimida: ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error(`Error al comprimir imagen: ${error.message}`);
    throw error;
  }
};

/**
 * Obtener metadata de imagen
 */
const getImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      resolution: `${metadata.width}x${metadata.height}`,
      format: metadata.format,
      size: metadata.size,
      space: metadata.space
    };
  } catch (error) {
    logger.error(`Error al obtener metadata de imagen: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getVideoMetadata,
  generateVideoThumbnail,
  generateImageThumbnail,
  compressImage,
  getImageMetadata
};