/**
 * @fileoverview Modelo de Radicación Consecutiva
 * @module models/ConsecutiveRadication
 * @description Modelo de Sequelize para la tabla consecutivo_radicado - gestiona números consecutivos de radicación
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ConsecutiveRadication = sequelize.define('ConsecutiveRadication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  radication: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'radicado'
  }
}, {
  tableName: 'consecutivo_radicado',
  timestamps: false,
  underscored: true
});

export default ConsecutiveRadication;
