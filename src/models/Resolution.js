/**
 * @fileoverview Modelo de Resolución
 * @module models/Resolution
 * @description Modelo de Sequelize para la tabla resolucion - gestiona resoluciones oficiales
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Resolution = sequelize.define('Resolution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  resolution: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'resolucion'
  }
}, {
  tableName: 'resolucion',
  timestamps: false,
  underscored: true
});

export default Resolution;
