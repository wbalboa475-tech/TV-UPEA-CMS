const { Program, File, Folder } = require('../models');
const logger = require('../utils/logger');

/**
 * @desc    Obtener todos los programas
 * @route   GET /api/programs
 * @access  Private
 */
const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['name', 'ASC']],
      include: [
        {
          model: File,
          as: 'files',
          attributes: ['id']
        },
        {
          model: Folder,
          as: 'folders',
          attributes: ['id']
        }
      ]
    });

    // Agregar contadores
    const programsWithStats = programs.map(program => ({
      ...program.toJSON(),
      filesCount: program.files?.length || 0,
      foldersCount: program.folders?.length || 0
    }));

    res.json({
      success: true,
      data: programsWithStats
    });
  } catch (error) {
    logger.error(`Error al obtener programas: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Obtener programa por ID
 * @route   GET /api/programs/:id
 * @access  Private
 */
const getProgramById = async (req, res, next) => {
  try {
    const program = await Program.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'files',
          limit: 20,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Folder,
          as: 'folders'
        }
      ]
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }

    res.json({
      success: true,
      data: program
    });
  } catch (error) {
    logger.error(`Error al obtener programa: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Crear programa
 * @route   POST /api/programs
 * @access  Private (Admin)
 */
const createProgram = async (req, res, next) => {
  try {
    const { name, description, color, icon, schedule, order } = req.body;

    // Generar slug
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const program = await Program.create({
      name,
      slug,
      description,
      color: color || '#3B82F6',
      icon: icon || 'tv',
      schedule,
      order: order || 0
    });

    logger.info(`Programa creado: ${name} por ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Programa creado exitosamente',
      data: program
    });
  } catch (error) {
    logger.error(`Error al crear programa: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Actualizar programa
 * @route   PUT /api/programs/:id
 * @access  Private (Admin)
 */
const updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }

    const { name, description, color, icon, schedule, order, isActive } = req.body;

    if (name) {
      program.name = name;
      program.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    if (description !== undefined) program.description = description;
    if (color) program.color = color;
    if (icon) program.icon = icon;
    if (schedule !== undefined) program.schedule = schedule;
    if (order !== undefined) program.order = order;
    if (isActive !== undefined) program.isActive = isActive;

    await program.save();

    logger.info(`Programa actualizado: ${program.id} por ${req.user.email}`);

    res.json({
      success: true,
      message: 'Programa actualizado exitosamente',
      data: program
    });
  } catch (error) {
    logger.error(`Error al actualizar programa: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Eliminar programa
 * @route   DELETE /api/programs/:id
 * @access  Private (Admin)
 */
const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }

    // Verificar si tiene archivos
    const filesCount = await File.count({ where: { programId: program.id } });
    if (filesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el programa porque tiene ${filesCount} archivos asociados`
      });
    }

    await program.destroy();

    logger.info(`Programa eliminado: ${program.id} por ${req.user.email}`);

    res.json({
      success: true,
      message: 'Programa eliminado exitosamente'
    });
  } catch (error) {
    logger.error(`Error al eliminar programa: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};