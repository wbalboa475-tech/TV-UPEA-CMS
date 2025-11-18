const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#3B82F6'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'tv'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  schedule: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Horario del programa'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'programs',
  timestamps: true
});

module.exports = Program;