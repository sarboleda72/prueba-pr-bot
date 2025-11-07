# API Gestión de Facturas - Cámara de Comercio para probar el pr review omitiendo

API REST para la gestión y consulta automatizada de facturas radicadas, diseñada para integración con sistemas RPA.

## 🏗️ Arquitectura

Este proyecto implementa el **patrón Repository**, organizando el código en capas con responsabilidades específicas:

```
src/
├── config/          # Configuraciones (BD, Swagger)
├── routes/          # Definición de endpoints HTTP
├── controllers/     # Coordinación y manejo de respuestas
├── services/        # Lógica de negocio y formateo
├── repositories/    # Acceso directo a base de datos
└── models/          # Definición de esquemas (Sequelize)
```

### Flujo de Datos
```
Cliente → Routes → Controllers → Services → Repositories → Base de Datos
                                                              ↓
Cliente ← JSON    ←    JSON     ←  Objeto  ←   Datos     ←  PostgreSQL
```

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- PostgreSQL (conexión remota configurada)

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd api-cc-repository

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de BD

# Iniciar servidor de desarrollo
npm run dev
```

### Servidor corriendo en:
- **API**: http://localhost:3000
- **Documentación**: http://localhost:3000/api-docs

## 📡 Endpoints Disponibles

### Facturas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/invoices/documentary-record-single-order` | Facturas con orden única |
| `GET` | `/api/invoices/documentary-record-multi-order` | Facturas con multiorden |
| `GET` | `/api/invoices/documentary-record` | Consolidado (óptimo para RPA) |

### Health Check
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado del servidor |

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **ORM**: Sequelize (solo operaciones DML)
- **Base de Datos**: PostgreSQL
- **Documentación**: Swagger/OpenAPI 3.0

## 📁 Estructura de Archivos

```
api-cc-repository/
├── src/
│   ├── config/
│   │   ├── database.js        # Conexión Sequelize (DML only)
│   │   └── swagger.js         # Configuración documentación
│   ├── models/
│   │   ├── Invoice.js         # Modelo principal
│   │   ├── Order.js
│   │   └── index.js           # Exportación de modelos
│   ├── repositories/
│   │   └── invoice.repository.js   # Consultas a BD
│   ├── services/
│   │   └── invoice.service.js      # Lógica de negocio
│   ├── controllers/
│   │   └── invoice.controller.js   # Manejo de requests
│   ├── routes/
│   │   ├── index.js           # Rutas principales
│   │   └── invoice.routes.js  # Rutas de facturas
│   └── app.js                 # Configuración Express
├── docs/
│   └── swagger.yaml           # Documentación OpenAPI
├── index.js                   # Punto de entrada
├── package.json
├── .env.example
└── README.md
```

## 📝 Scripts Disponibles

```bash
npm start       # Iniciar servidor producción
npm run dev     # Iniciar con nodemon (desarrollo)
```

## 📚 Documentación Adicional

- **Swagger UI**: Disponible en `/api-docs` cuando el servidor está corriendo
- **Modelos**: Ver `src/models/` para esquemas completos de BD
- **Consultas SQL**: Logs habilitados en desarrollo (ver consola)

## 👥 Equipo

**CyT Consultores** - Desarrollo y Mantenimiento

## 📄 Licencia

ISC

---

**Última actualización**: Octubre 2025
