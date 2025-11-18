const { Folder, File, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * @desc    Crear carpeta
 * @route   POST /api/folders
 * @access  Private
 */
const createFolder = async (req, res, next) => {
  try {
    const { name, description, parentId, program, color, icon } = req.body;

    // Verificar si la carpeta padre existe
    if (parentId) {
      const parentFolder = await Folder.findByPk(parentId);
      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: 'Carpeta padre no encontrada'
        });
      }
    }

    // Crear carpeta
    const folder = await Folder.create({
      name,
      description,
      parentId: parentId || null,
      program,
      color: color || '#3B82F6',
      icon: icon || 'folder',
      ownerId: req.user.id
    });

    logger.info(`Carpeta creada: ${name} por ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Carpeta creada exitosamente',
      data: folder
    });
  } catch (error) {
    logger.error(`Error al crear carpeta: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Obtener todas las carpetas
 * @route   GET /api/folders
 * @access  Private
 */
const getFolders = async (req, res, next) => {
  try {
    const { parentId, search } = req.query;

    const where = {};
    
    if (parentId === 'root' || !parentId) {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }
    
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const folders = await Folder.findAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { 
          model: Folder, 
          as: 'subfolders',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: folders
    });
  } catch (error) {
    logger.error(`Error al obtener carpetas: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Obtener carpeta por ID
 * @route   GET /api/folders/:id
 * @access  Private
 */
const getFolderById = async (req, res, next) => {
  try {
    const folder = await Folder.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Folder, as: 'subfolders' },
        { 
          model: File, 
          as: 'files',
          include: [
            { model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }
          ]
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Carpeta no encontrada'
      });
    }

    res.json({
      success: true,
      data: folder
    });
  } catch (error) {
    logger.error(`Error al obtener carpeta: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Actualizar carpeta
 * @route   PUT /api/folders/:id
 * @access  Private
 */
const updateFolder = async (req, res, next) => {
  try {
    const { name, description, program, color, icon, parentId } = req.body;
    
    const folder = await Folder.findByPk(req.params.id);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Carpeta no encontrada'
      });
    }

    // Verificar permisos
    if (folder.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta carpeta'
      });
    }

    // Actualizar campos
    if (name) folder.name = name;
    if (description !== undefined) folder.description = description;
    if (program !== undefined) folder.program = program;
    if (color) folder.color = color;
    if (icon) folder.icon = icon;
    if (parentId !== undefined) folder.parentId = parentId;

    await folder.save();

    logger.info(`Carpeta actualizada: ${folder.id} por ${req.user.email}`);

    res.json({
      success: true,
      message: 'Carpeta actualizada exitosamente',
      data: folder
    });
  } catch (error) {
    logger.error(`Error al actualizar carpeta: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Eliminar carpeta
 * @route   DELETE /api/folders/:id
 * @access  Private
 */
const deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findByPk(req.params.id);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Carpeta no encontrada'
      });
    }

    // Verificar permisos
    if (folder.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta carpeta'
      });
    }

    // Verificar si tiene subcarpetas o archivos
    const subfolders = await Folder.count({ where: { parentId: folder.id } });
    const files = await File.count({ where: { folderId: folder.id } });

    if (subfolders > 0 || files > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una carpeta que contiene subcarpetas o archivos'
      });
    }

    await folder.destroy();

    logger.info(`Carpeta eliminada: ${folder.id} por ${req.user.email}`);

    res.json({
      success: true,
      message: 'Carpeta eliminada exitosamente'
    });
  } catch (error) {
    logger.error(`Error al eliminar carpeta: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder
};

