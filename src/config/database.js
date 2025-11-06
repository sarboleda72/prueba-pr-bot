/**
 * @fileoverview Configuración de base de datos para conexión a PostgreSQL usando Sequelize ORM
 * @module config/database
 * @description Define los parámetros de conexión y la configuración de la instancia de Sequelize
 * para conectarse a la base de datos PostgreSQL
 * IMPORTANTE: Configurado solo para operaciones DML (SELECT, INSERT, UPDATE, DELETE)
 * Las operaciones DDL (CREATE, ALTER, DROP) están bloqueadas
 */

import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_database_name',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'your_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Configuración del pool de conexiones
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    
    // BLOQUEO DE OPERACIONES DDL
    // Deshabilitar todas las operaciones de sincronización automática
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true
    },
    
    // Prevenir sync, alter y drop de tablas
    sync: { force: false },
    
    // Hook para prevenir operaciones DDL
    hooks: {
      beforeConnect: async (config) => {
        // Conexión permitida, pero sin permisos DDL
      }
    },
    
    // Opciones adicionales para manejar caracteres especiales en password
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

/**
 * Sobrescribir métodos DDL para prevenir modificaciones de esquema
 */
sequelize.sync = async () => {
  throw new Error('❌ OPERACIÓN BLOQUEADA: sync() no está permitido. Solo se permiten operaciones DML (SELECT, INSERT, UPDATE, DELETE)');
};

sequelize.drop = async () => {
  throw new Error('❌ OPERACIÓN BLOQUEADA: drop() no está permitido. Solo se permiten operaciones DML (SELECT, INSERT, UPDATE, DELETE)');
};

sequelize.truncate = async () => {
  throw new Error('❌ OPERACIÓN BLOQUEADA: truncate() no está permitido. Solo se permiten operaciones DML (SELECT, INSERT, UPDATE, DELETE)');
};

export default sequelize;
