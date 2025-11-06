/**
 * @fileoverview Punto de entrada principal de la aplicación
 * @module index
 * @description Inicia el servidor Express y establece la conexión con la base de datos
 */

import 'dotenv/config';
import app from './src/app.js';
import sequelize from './src/config/database.js';

const PORT = process.env.PORT || 3000;

/**
 * Función para iniciar el servidor
 */
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    console.log('🔒 Modo: Solo operaciones DML (SELECT, INSERT, UPDATE, DELETE)');
    console.log('⛔ Operaciones DDL bloqueadas (CREATE, ALTER, DROP, SYNC)');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar la aplicación
startServer();
