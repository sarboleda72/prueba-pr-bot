/**
 * @fileoverview Índice de modelos con relaciones
 * @module models/index
 * @description Módulo central que importa todos los modelos de Sequelize y define sus relaciones
 * Importa este archivo para acceder a cualquier modelo con las asociaciones establecidas
 */

import sequelize from '../config/database.js';

// Importar todos los modelos
import ConsecutiveRadication from './ConsecutiveRadication.js';
import Cpc from './Cpc.js';
import CpcWithoutOrder from './CpcWithoutOrder.js';
import Invoice from './Invoice.js';
import RadicatedInvoice from './RadicatedInvoice.js';
import ReceptionDate from './ReceptionDate.js';
import Order from './Order.js';
import ContractPercentage from './ContractPercentage.js';
import Resolution from './Resolution.js';
import Withholding from './Withholding.js';

// Definir relaciones entre modelos
// NOTA: Las relaciones están comentadas temporalmente para evitar conflictos
// Se pueden habilitar cuando sea necesario realizar consultas con joins


// Relación Invoice - Order (basada en número de orden)
Invoice.belongsTo(Order, {
  foreignKey: 'order',
  targetKey: 'order',
  as: 'orderDetails',
  constraints: false
});
Order.hasMany(Invoice, {
  foreignKey: 'order',
  sourceKey: 'order',
  as: 'invoices',
  constraints: false
});

// Relación Invoice - Withholding (basada en nit)
Invoice.belongsTo(Withholding, {
  foreignKey: 'nit',
  targetKey: 'nit',
  as: 'withholdingInfo',
  constraints: false
});
Withholding.hasMany(Invoice, {
  foreignKey: 'nit',
  sourceKey: 'nit',
  as: 'invoices',
  constraints: false
});

// Relación Order - Withholding (basada en nit)
Order.belongsTo(Withholding, {
  foreignKey: 'nit',
  targetKey: 'nit',
  as: 'withholdingInfo',
  constraints: false
});
Withholding.hasMany(Order, {
  foreignKey: 'nit',
  sourceKey: 'nit',
  as: 'orders',
  constraints: false
});

// Relación RadicatedInvoice - Order (basada en nit)
RadicatedInvoice.belongsTo(Order, {
  foreignKey: 'nit',
  targetKey: 'nit',
  as: 'orderInfo',
  constraints: false
});
Order.hasMany(RadicatedInvoice, {
  foreignKey: 'nit',
  sourceKey: 'nit',
  as: 'radicatedInvoices',
  constraints: false
});

// Relación ContractPercentage - Withholding (basada en nit)
ContractPercentage.belongsTo(Withholding, {
  foreignKey: 'nit',
  targetKey: 'nit',
  as: 'withholdingInfo',
  constraints: false
});
Withholding.hasMany(ContractPercentage, {
  foreignKey: 'nit',
  sourceKey: 'nit',
  as: 'contractPercentages',
  constraints: false
});

// Relación CpcWithoutOrder - Withholding (basada en nit)
CpcWithoutOrder.belongsTo(Withholding, {
  foreignKey: 'nit',
  targetKey: 'nit',
  as: 'withholdingInfo',
  constraints: false
});
Withholding.hasMany(CpcWithoutOrder, {
  foreignKey: 'nit',
  sourceKey: 'nit',
  as: 'cpcWithoutOrders',
  constraints: false
});


// Exportar todos los modelos y la instancia de sequelize
export {
  sequelize,
  ConsecutiveRadication,
  Cpc,
  CpcWithoutOrder,
  Invoice,
  RadicatedInvoice,
  ReceptionDate,
  Order,
  ContractPercentage,
  Resolution,
  Withholding
};
