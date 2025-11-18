const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Tamaño en bytes'
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  extension: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL del archivo en S3 o storage'
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL del thumbnail (para videos e imágenes)'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duración en segundos (solo videos)'
  },
  resolution: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Resolución (ej: 1920x1080)'
  },
  codec: {
    type: DataTypes.STRING,
    allowNull: true
  },
  folderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'folders',
      key: 'id'
    }
  },
  programId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'failed', 'archived'),
    defaultValue: 'uploading'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Metadata adicional del archivo'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'files',
  timestamps: true,
  paranoid: true // Soft delete
});

module.exports = File;