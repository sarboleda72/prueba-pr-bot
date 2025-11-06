/**
 * @fileoverview Modelo de Retención
 * @module models/Withholding
 * @description Modelo de Sequelize para la tabla retencion - gestiona información de retenciones fiscales
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Withholding = sequelize.define('Withholding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  nit: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nit'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nombre'
  },
  fees: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'honorarios'
  },
  base: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'base'
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'codigo'
  },
  vatWithholding: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'reteiva'
  }
}, {
  tableName: 'retencion',
  timestamps: false,
  underscored: true
});

export default Withholding;
