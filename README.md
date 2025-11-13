# dian-api

## Descripción para revisar el code review 7 desacoplado pascal camel 2123123123
Este proyecto es una API para la gestión de facturas electrónicas, utilizando Sequelize como ORM para interactuar con la base de datos. La API permite crear facturas, verificar la existencia de entidades (emisores y receptores), generar reportes en formato Excel y realizar autenticación mediante JWT.

## Requisitos
- Node.js
- PostgreSQL

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```env
   JWT_USER=<usuario_jwt>
   JWT_PASSWORD=<contraseña_jwt>
   JWT_SECRETO=<secreto_jwt>
   JWT_TIEMPO_EXPIRA=<tiempo_expiracion_jwt>
   ETL_WS=<url_servicio_etl>
   ```

## Uso
1. Inicia el servidor:
   ```bash
   npm start
   ```
2. La API estará disponible en `http://localhost:4000`.

## Endpoints

### Autenticación
- **POST /auth/token**
  - **Descripción**: Autentica un usuario y devuelve un token JWT.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "usuario": "string",
      "clave": "string"
    }
    ```
  - **Respuesta**:
    ```json
    {
      "status": 200,
      "message": "Autenticado",
      "data": "token_jwt"
    }
    ```

### Facturas
- **POST /facturas**
  - **Descripción**: Crea una nueva factura.
  - **Autenticación**: Requiere un token JWT en el encabezado `Authorization`.
  - **Cuerpo de la solicitud**:
    ```json
    {
      "clienteNombre": "string",
      "clienteDocumento": "string",
      "Lote": "string",
      "CUFE": "string",
      "nombreEmisor": "string",
      "nitEmisor": "string",
      "nombreReceptor": "string",
      "nitReceptor": "string",
      "fechaEmision": "string",
      "folio": "string",
      "serie": "string",
      "IVA": "string",
      "total": "string",
      "pdf": "base64",
      "acuses": {
        "030": true,
        "031": true,
        "032": true,
        "033": true
      }
    }
    ```
  - **Respuesta**:
    ```json
    {
      "status": 200,
      "message": "Factura creada correctamente.",
      "data": { ... }
    }
    ```

- **GET /facturas/reporte**
  - **Descripción**: Genera un reporte de facturas en formato Excel.
  - **Autenticación**: Requiere un token JWT en el encabezado `Authorization`.
  - **Parámetros de consulta**:
    - `lote` (requerido): Lote de facturas a consultar.
    - `responseType` (opcional): Tipo de respuesta deseada (`descarga` o `base64`).
  - **Ejemplo de solicitud**:
    - Para descargar el archivo:
      ```
      GET /facturas/reporte?lote=42343242334&responseType=descarga
      ```
    - Para obtener el archivo en Base64:
      ```
      GET /facturas/reporte?lote=42343242334
      ```
  - **Respuesta (Base64)**:
    ```json
    {
      "status": 200,
      "message": "Reporte generado correctamente.",
      "data": {
        "excelBase64": "UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA=="
      }
    }
    ```

## Estructura del Proyecto
- `src/controllers`: Controladores de la API.
- `src/middlewares`: Middlewares para autenticación y autorización.
- `src/models`: Modelos de Sequelize.
- `src/routes`: Rutas de la API.
- `src/services`: Servicios para la lógica de negocio.
- `src/utils`: Utilidades como generación de archivos Excel.

## Ejemplo de Solicitud en Postman

### Crear Factura
1. **Método**: POST
2. **URL**: `http://localhost:4000/facturas`
3. **Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer <tu_token_jwt>`
4. **Body**: Selecciona `raw` y `JSON`, luego pega el siguiente JSON:
    ```json
    {
      "clienteNombre": "Juan Perez",
      "clienteDocumento": "123456789",
      "Lote": "42343242334",
      "CUFE": "ABC123456789",
      "nombreEmisor": "Empresa Emisora",
      "nitEmisor": "987654321",
      "nombreReceptor": "Empresa Receptora",
      "nitReceptor": "123456789",
      "fechaEmision": "2025-03-12",
      "folio": "001",
      "serie": "A",
      "IVA": "19.00",
      "total": "1000.00",
      "pdf": "base64",
      "acuses": {
        "030": true,
        "031": true,
        "032": true,
        "033": true
      }
    }
    ```

### Generar Reporte
1. **Método**: GET
2. **URL**: `http://localhost:4000/facturas/reporte?lote=42343242334&responseType=descarga`
3. **Headers**:
   - `Authorization`: `Bearer <tu_token_jwt>`

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que desees realizar.
