const { File, Folder, User, Tag } = require('../models');
const { Op } = require('sequelize');
const { uploadToS3, deleteFromS3, getSignedUrl } = require('../services/storageService');
const { getVideoMetadata, generateVideoThumbnail, getImageMetadata, generateImageThumbnail } = require('../services/mediaService');
const { generateUniqueFileName } = require('../utils/helpers');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Subir archivo(s)
 * @route   POST /api/files/upload
 * @access  Private
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const { folderId, tags, programId } = req.body;
    const file = req.file;

    // Verificar carpeta si se proporcionó
    if (folderId) {
      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        fs.unlinkSync(file.path);
        return res.status(404).json({
          success: false,
          message: 'Carpeta no encontrada'
        });
      }
    }

    // Generar nombre único
    const uniqueFileName = generateUniqueFileName(file.originalname);
    
    // Subir a S3 (o guardar localmente si no tienes S3 configurado)
    let fileUrl = file.path; // Por ahora guardar local
    let thumbnailUrl = null;
    let metadata = {};

    // Procesar según tipo de archivo
    if (file.mimetype.startsWith('video/')) {
      // Obtener metadata de video
      metadata = await getVideoMetadata(file.path);
      
      // Generar thumbnail
      const thumbnailPath = path.join(path.dirname(file.path), `thumb_${uniqueFileName}.jpg`);
      await generateVideoThumbnail(file.path, thumbnailPath);
      thumbnailUrl = thumbnailPath;
    } else if (file.mimetype.startsWith('image/')) {
      // Obtener metadata de imagen
      metadata = await getImageMetadata(file.path);
      
      // Generar thumbnail
      const thumbnailPath = path.join(path.dirname(file.path), `thumb_${uniqueFileName}`);
      await generateImageThumbnail(file.path, thumbnailPath);
      thumbnailUrl = thumbnailPath;
    }

    // Crear registro en BD
    const newFile = await File.create({
      originalName: file.originalname,
      fileName: uniqueFileName,
      size: file.size,
      mimeType: file.mimetype,
      extension: path.extname(file.originalname),
      url: fileUrl,
      thumbnailUrl,
      duration: metadata.duration || null,
      resolution: metadata.resolution || null,
      codec: metadata.codec || null,
      folderId: folderId || null,
      programId: programId || null,
      uploadedBy: req.user.id,
      status: 'ready',
      metadata: metadata
    });

    // Agregar tags si se proporcionaron
    if (tags && Array.isArray(tags)) {
      const tagInstances = await Promise.all(
        tags.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName },
            defaults: { slug: tagName.toLowerCase().replace(/\s+/g, '-') }
          });
          return tag;
        })
      );
      await newFile.setTags(tagInstances);
    }

    logger.info(`Archivo subido: ${file.originalname} por ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: newFile
    });
  } catch (error) {
    logger.error(`Error al subir archivo: ${error.message}`);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @desc    Obtener todos los archivos
 * @route   GET /api/files
 * @access  Private
 */
const getFiles = async (req, res, next) => {
  try {
    const { folderId, search, type, page = 1, limit = 20 } = req.query;
    const programId = req.query.programId;

    const where = {};
    
    if (folderId) {
      where.folderId = folderId;
    }
    
    if (programId) {
      where.programId = programId;
    }
    
    if (search) {
      where.originalName = { [Op.iLike]: `%${search}%` };
    }
    
    if (type) {
      where.mimeType = { [Op.startsWith]: type };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await File.findAndCountAll({
      where,
      include: [
        { 
          model: User, 
          as: 'uploader', 
          attributes: ['id', 'name', 'email', 'avatar'] 
        },
        { 
          model: Folder, 
          as: 'folder', 
          attributes: ['id', 'name'] 
        },
        { 
          model: Tag, 
          as: 'tags', 
          through: { attributes: [] } 
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        files: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error(`Error al obtener archivos: ${error.message}`);
    next(error);
  }
};
/**
 * @desc    Obtener un archivo por ID
 * @route   GET /api/files/:id
 * @access  Private
 */
const getFileById = async (req, res, next) => {
  try {
    const file = await File.findByPk(req.params.id, {
      include: [
        { model: User, as: 'uploader', attributes: ['id', 'name', 'email', 'avatar'] },
        { model: Folder, as: 'folder' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Incrementar vistas
    await file.increment('views');

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    logger.error(`Error al obtener archivo: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Actualizar archivo
 * @route   PUT /api/files/:id
 * @access  Private
 */
const updateFile = async (req, res, next) => {
  try {
    const { originalName, folderId, tags } = req.body;
    
    const file = await File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar permisos
    if (file.uploadedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este archivo'
      });
    }

    // Actualizar campos
    if (originalName) file.originalName = originalName;
    if (folderId !== undefined) file.folderId = folderId;

    await file.save();

    // Actualizar tags
    if (tags && Array.isArray(tags)) {
      const tagInstances = await Promise.all(
        tags.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName },
            defaults: { slug: tagName.toLowerCase().replace(/\s+/g, '-') }
          });
          return tag;
        })
      );
      await file.setTags(tagInstances);
    }

    logger.info(`Archivo actualizado: ${file.id} por ${req.user.email}`);

    res.json({
      success: true,
      message: 'Archivo actualizado exitosamente',
      data: file
    });
  } catch (error) {
    logger.error(`Error al actualizar archivo: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Eliminar archivo
 * @route   DELETE /api/files/:id
 * @access  Private
 */
const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar permisos
    if (file.uploadedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este archivo'
      });
    }

    // Eliminar archivos físicos
    if (fs.existsSync(file.url)) {
      fs.unlinkSync(file.url);
    }
    if (file.thumbnailUrl && fs.existsSync(file.thumbnailUrl)) {
      fs.unlinkSync(file.thumbnailUrl);
    }

    // Soft delete
    await file.destroy();

    logger.info(`Archivo eliminado: ${file.id} por ${req.user.email}`);

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });
  } catch (error) {
    logger.error(`Error al eliminar archivo: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Descargar archivo
 * @route   GET /api/files/:id/download
 * @access  Private
 */
const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Incrementar contador de descargas
    await file.increment('downloads');

    // Enviar archivo
    res.download(file.url, file.originalName);

    logger.info(`Archivo descargado: ${file.id} por ${req.user.email}`);
  } catch (error) {
    logger.error(`Error al descargar archivo: ${error.message}`);
    next(error);
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  downloadFile
};