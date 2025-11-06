/**
 * @fileoverview Modelo de Fecha de Recepción
 * @module models/ReceptionDate
 * @description Modelo de Sequelize para la tabla fechas_recepcion - gestiona fechas de recepción por mes
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ReceptionDate = sequelize.define('ReceptionDate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  monthName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'mes_nombre'
  },
  month: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'mes'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha'
  }
}, {
  tableName: 'fechas_recepcion',
  timestamps: false,
  underscored: true
});

export default ReceptionDate;
