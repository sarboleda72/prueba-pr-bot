# 🐳 Guía de Dockerización - OCGN Órdenes Backend

## 📋 Prerequisitos

- Docker Desktop instalado (Windows/Mac) o Docker Engine (Linux)
- Docker Compose incluido

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Luego edita `.env` con tus credenciales reales.

### 2. Construir y ejecutar con Docker Compose (Recomendado)

```bash
# Construir la imagen y ejecutar el contenedor
docker-compose up --build

# O en modo detached (en segundo plano)
docker-compose up -d --build
```

La aplicación estará disponible en: `http://localhost:8000`

### 3. Alternativamente, usar Docker directamente

```bash
# Construir la imagen
docker build -t ocgn-ordenes-backend .

# Ejecutar el contenedor
docker run -p 8000:8000 --env-file .env ocgn-ordenes-backend
```

## 🛠️ Comandos Útiles

### Ver logs
```bash
# Con docker-compose
docker-compose logs -f

# Con docker directamente
docker logs -f ocgn-ordenes-backend
```

### Detener la aplicación
```bash
# Con docker-compose
docker-compose down

# Con docker directamente
docker stop ocgn-ordenes-backend
```

### Reiniciar la aplicación
```bash
docker-compose restart
```

### Reconstruir después de cambios en el código
```bash
docker-compose up --build
```

### Entrar al contenedor (para debugging)
```bash
docker exec -it ocgn-ordenes-backend bash
```

## 🌐 Desplegar en Azure

### Opción 1: Azure Container Instances (ACI)

```bash
# Login a Azure
az login

# Crear un grupo de recursos
az group create --name ocgn-ordenes-rg --location eastus

# Crear Azure Container Registry (ACR)
az acr create --resource-group ocgn-ordenes-rg --name ocgnordenesacr --sku Basic

# Login al ACR
az acr login --name ocgnordenesacr

# Etiquetar la imagen
docker tag ocgn-ordenes-backend ocgnordenesacr.azurecr.io/ocgn-ordenes-backend:latest

# Subir la imagen
docker push ocgnordenesacr.azurecr.io/ocgn-ordenes-backend:latest

# Desplegar en ACI
az container create \
  --resource-group ocgn-ordenes-rg \
  --name ocgn-ordenes-backend \
  --image ocgnordenesacr.azurecr.io/ocgn-ordenes-backend:latest \
  --cpu 1 --memory 2 \
  --registry-login-server ocgnordenesacr.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --dns-name-label ocgn-ordenes \
  --ports 8000 \
  --environment-variables \
    POSTGRES_DB=<tu-db> \
    POSTGRES_USER=<tu-user> \
    POSTGRES_PASSWORD=<tu-pass> \
    POSTGRES_SERVER=<tu-server> \
    POSTGRES_PORT=5432 \
    WEBSERVICE_USER=<tu-user> \
    WEBSERVICE_PASSWORD=<tu-pass> \
    WEBSERVICE_URL=https://wscyt.ocgnlocal.co
```

### Opción 2: Azure App Service (Web App for Containers)

```bash
# Crear App Service Plan
az appservice plan create \
  --name ocgn-ordenes-plan \
  --resource-group ocgn-ordenes-rg \
  --is-linux \
  --sku B1

# Crear Web App
az webapp create \
  --resource-group ocgn-ordenes-rg \
  --plan ocgn-ordenes-plan \
  --name ocgn-ordenes-backend \
  --deployment-container-image-name ocgnordenesacr.azurecr.io/ocgn-ordenes-backend:latest

# Configurar variables de entorno
az webapp config appsettings set \
  --resource-group ocgn-ordenes-rg \
  --name ocgn-ordenes-backend \
  --settings \
    POSTGRES_DB=<tu-db> \
    POSTGRES_USER=<tu-user> \
    POSTGRES_PASSWORD=<tu-pass> \
    POSTGRES_SERVER=<tu-server> \
    POSTGRES_PORT=5432 \
    WEBSERVICE_USER=<tu-user> \
    WEBSERVICE_PASSWORD=<tu-pass> \
    WEBSERVICE_URL=https://wscyt.ocgnlocal.co

# Configurar puerto
az webapp config appsettings set \
  --resource-group ocgn-ordenes-rg \
  --name ocgn-ordenes-backend \
  --settings WEBSITES_PORT=8000
```

## 🔍 Verificar la aplicación

Una vez desplegada, verifica:

1. Health check: `http://<tu-url>:8000/docs`
2. API docs: `http://<tu-url>:8000/docs`

## 📝 Notas Importantes

- El contenedor expone el puerto 8000
- Las variables de entorno deben configurarse correctamente
- Los logs se pueden ver con `docker-compose logs` o en Azure Portal
- Para producción, considera usar un servicio de base de datos gestionado (Azure Database for PostgreSQL)

## 🐛 Troubleshooting

### Error de conexión a la base de datos
- Verifica que `POSTGRES_SERVER` sea accesible desde el contenedor
- Si usas `localhost`, cámbialo a la IP del host o nombre del servicio

### El contenedor se detiene inmediatamente
- Verifica los logs: `docker-compose logs`
- Asegúrate de que todas las variables de entorno estén configuradas

### Error "No module named 'X'"
- Reconstruye la imagen: `docker-compose up --build`
- Verifica que la dependencia esté en `requirements.txt`
