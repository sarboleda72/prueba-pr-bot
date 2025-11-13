# 🐳 Guía Rápida - Docker Desktop

## ✅ Tu aplicación está corriendo!

**URL de la aplicación:** http://localhost:8000

**Documentación API (Swagger):** http://localhost:8000/docs

---

## 📝 Comandos Esenciales

### Ver si el contenedor está corriendo:
```bash
docker ps
```

### Ver logs en tiempo real:
```bash
docker logs -f ocgn-ordenes-backend
```

### Detener el contenedor:
```bash
docker stop ocgn-ordenes-backend
```

### Iniciar el contenedor detenido:
```bash
docker start ocgn-ordenes-backend
```

### Reiniciar el contenedor:
```bash
docker restart ocgn-ordenes-backend
```

### Ver logs de las últimas 100 líneas:
```bash
docker logs ocgn-ordenes-backend --tail 100
```

---

## 🔨 Cuando hagas cambios en el código

### 1. Detener y eliminar el contenedor actual:
```bash
docker stop ocgn-ordenes-backend
docker rm ocgn-ordenes-backend
```

### 2. Reconstruir la imagen:
```bash
docker build -t ocgn-ordenes-backend .
```

### 3. Ejecutar el nuevo contenedor:
```bash
docker run -d --name ocgn-ordenes-backend -p 8000:8000 --env-file .env ocgn-ordenes-backend
```

### O todo en uno (más fácil):
```bash
./docker-manager.sh rebuild
```

---

## 🛠️ Usar el Script Manager (más fácil)

He creado un script para facilitar el manejo:

```bash
# Ver comandos disponibles
./docker-manager.sh

# Iniciar
./docker-manager.sh start

# Ver logs
./docker-manager.sh logs

# Reiniciar
./docker-manager.sh restart

# Reconstruir todo (después de cambios en código)
./docker-manager.sh rebuild

# Detener
./docker-manager.sh stop

# Ver estado
./docker-manager.sh status

# Acceder al shell del contenedor
./docker-manager.sh shell
```

---

## 🐛 Troubleshooting

### El contenedor no inicia:
```bash
# Ver logs de error
docker logs ocgn-ordenes-backend

# Ver todos los contenedores (incluso detenidos)
docker ps -a
```

### Puerto 8000 ya está en uso:
```bash
# Opción 1: Detener el proceso que usa el puerto
# En Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Opción 2: Usar otro puerto
docker run -d --name ocgn-ordenes-backend -p 8001:8000 --env-file .env ocgn-ordenes-backend
# Entonces acceder a http://localhost:8001
```

### Necesito borrar todo y empezar de nuevo:
```bash
docker stop ocgn-ordenes-backend
docker rm ocgn-ordenes-backend
docker rmi ocgn-ordenes-backend
docker build -t ocgn-ordenes-backend .
docker run -d --name ocgn-ordenes-backend -p 8000:8000 --env-file .env ocgn-ordenes-backend
```

---

## ☁️ Para subir a Azure

### 1. Crear Azure Container Registry:
```bash
az login
az acr create --resource-group tu-rg --name ocgnacr --sku Basic
az acr login --name ocgnacr
```

### 2. Tag y Push:
```bash
docker tag ocgn-ordenes-backend ocgnacr.azurecr.io/ocgn-ordenes-backend:latest
docker push ocgnacr.azurecr.io/ocgn-ordenes-backend:latest
```

### 3. Desplegar en Azure Container Instances:
```bash
az container create \
  --resource-group tu-rg \
  --name ocgn-ordenes \
  --image ocgnacr.azurecr.io/ocgn-ordenes-backend:latest \
  --cpu 1 --memory 2 \
  --dns-name-label ocgn-ordenes \
  --ports 8000 \
  --environment-variables \
    POSTGRES_DB=ocgn_autorizaciones \
    POSTGRES_USER=ocgn_user \
    POSTGRES_PASSWORD=0CgN202A$ \
    POSTGRES_SERVER=40.121.222.132 \
    POSTGRES_PORT=5432 \
    WEBSERVICE_USER=C_T \
    WEBSERVICE_PASSWORD=C_T2o2A \
    WEBSERVICE_URL=https://wscyt.ocgnlocal.co \
    ETL_WS_URL=https://etl-ocgn.azurewebsites.net
```

---

## 📊 Monitoreo

### Ver uso de recursos:
```bash
docker stats ocgn-ordenes-backend
```

### Ver procesos dentro del contenedor:
```bash
docker top ocgn-ordenes-backend
```

### Inspeccionar configuración del contenedor:
```bash
docker inspect ocgn-ordenes-backend
```

---

## 💡 Tips

1. **Los logs muestran todo:** Siempre revisa los logs con `docker logs -f` para ver qué está pasando

2. **El contenedor es efímero:** Si eliminas el contenedor, los datos dentro se pierden (pero tu código está en tu máquina)

3. **Hot reload:** Si quieres desarrollo con hot-reload, usa:
   ```bash
   docker run -d --name ocgn-ordenes-backend -p 8000:8000 --env-file .env -v $(pwd):/app ocgn-ordenes-backend uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Ver todos los contenedores:** Usa `docker ps -a` para ver incluso los detenidos

---

## 🎯 Próximos pasos

- ✅ La aplicación está corriendo localmente en Docker
- ⏭️ Probar los endpoints en http://localhost:8000/docs
- ⏭️ Verificar que los scheduled jobs funcionen (revisa logs cada hora)
- ⏭️ Cuando esté todo OK, desplegar en Azure
