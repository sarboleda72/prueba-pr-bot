const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entity = sequelize.define('Entity', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'nombre',
  },
  nit: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
  tableName: 'entidades',
});

module.exports = Entity;