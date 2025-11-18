const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Folder = sequelize.define('Folder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parentId: {
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
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#3B82F6'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'folder'
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ruta completa de la carpeta'
  }
}, {
  tableName: 'folders',
  timestamps: true
});

// Relación consigo mismo (carpetas anidadas)
Folder.hasMany(Folder, { 
  foreignKey: 'parentId', 
  as: 'subfolders' 
});
Folder.belongsTo(Folder, { 
  foreignKey: 'parentId', 
  as: 'parent' 
});

module.exports = Folder;