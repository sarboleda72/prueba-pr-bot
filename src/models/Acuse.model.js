const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Acuse = sequelize.define('Acuse', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status030: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: '030',
  },
  status031: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: '031',
  },
  status032: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: '032',
  },
  status033: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: '033',
  },
}, {
  timestamps: false,
  tableName: 'acuses',
});

module.exports = Acuse;