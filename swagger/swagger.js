const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DIAN API',
      version: '1.0.0',
      description: 'API para la gestión de facturas electrónicas',
      contact: {
        name: 'CYT'
      },
    },
    servers: [
      {
        url: '',
        description: 'Deploy'
      }  
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./swagger/*.yml']
};

const specs = swaggerJsdoc(options);
module.exports = specs;