const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.ENUM(
      'login', 'logout',
      'file_upload', 'file_download', 'file_delete', 'file_update', 'file_view',
      'folder_create', 'folder_delete', 'folder_update',
      'user_create', 'user_update', 'user_delete',
      'permission_grant', 'permission_revoke',
      'comment_create', 'comment_delete'
    ),
    allowNull: false
  },
  resourceType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resourceId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Detalles adicionales de la actividad'
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'activities',
  timestamps: true,
  updatedAt: false // Las actividades no se actualizan
});

module.exports = Activity;