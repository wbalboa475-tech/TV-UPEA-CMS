const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Permission = sequelize.define('Permission', {
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
  resourceType: {
    type: DataTypes.ENUM('folder', 'file'),
    allowNull: false
  },
  resourceId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  permission: {
    type: DataTypes.ENUM('view', 'edit', 'delete', 'share', 'admin'),
    allowNull: false
  },
  grantedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de expiración del permiso'
  }
}, {
  tableName: 'permissions',
  timestamps: true
});

module.exports = Permission;