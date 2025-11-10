// ✅ EJEMPLO CORRECTO
// Configuración con constantes en UPPER_SNAKE_CASE

const DATABASE_HOST = process.env.DB_HOST || 'localhost';
const DATABASE_PORT = process.env.DB_PORT || 5432;
const DATABASE_NAME = process.env.DB_NAME || 'testdb';
const DATABASE_USER = process.env.DB_USER || 'postgres';
const DATABASE_PASSWORD = process.env.DB_PASSWORD || '';

const API_PORT = process.env.PORT || 3000;
const API_VERSION = 'v1';
const ENABLE_LOGGING = process.env.NODE_ENV !== 'production';

const config = {
  database: {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    name: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD
  },
  api: {
    port: API_PORT,
    version: API_VERSION,
    enableLogging: ENABLE_LOGGING
  }
};

module.exports = config;
