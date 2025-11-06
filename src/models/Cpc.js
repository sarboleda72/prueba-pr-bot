/**
 * @fileoverview Modelo de CPC
 * @module models/Cpc
 * @description Modelo de Sequelize para la tabla cpc - gestiona registros de CPC
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cpc = sequelize.define('Cpc', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  order: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'orden'
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'descripcion'
  },
  cpcNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'numero_cpc'
  }
}, {
  tableName: 'cpc',
  timestamps: false,
  underscored: true
});

export default Cpc;
