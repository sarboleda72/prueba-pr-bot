/**
 * @fileoverview Configuración de Swagger
 * @module config/swagger
 * @description Configuración de la documentación de la API con Swagger UI
 */

import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer el archivo YAML
const swaggerDocument = yaml.parse(
  readFileSync(join(__dirname, '../../docs/swagger.yaml'), 'utf8')
);

// Opciones de personalización de Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Cámara de Comercio - Documentación',
  customfavIcon: '/favicon.ico'
};

export { swaggerUi, swaggerDocument, swaggerOptions };
