#!/bin/bash
# Script para manejar el contenedor Docker de OCGN Órdenes Backend

CONTAINER_NAME="ocgn-ordenes-backend"
IMAGE_NAME="ocgn-ordenes-backend"

case "$1" in
  start)
    echo "🚀 Iniciando el contenedor..."
    docker run -d --name $CONTAINER_NAME -p 8000:8000 --env-file .env $IMAGE_NAME
    echo "✅ Contenedor iniciado. Accede a http://localhost:8000/docs"
    ;;
    
  stop)
    echo "🛑 Deteniendo el contenedor..."
    docker stop $CONTAINER_NAME
    echo "✅ Contenedor detenido"
    ;;
    
  restart)
    echo "🔄 Reiniciando el contenedor..."
    docker restart $CONTAINER_NAME
    echo "✅ Contenedor reiniciado"
    ;;
    
  logs)
    echo "📋 Mostrando logs (Ctrl+C para salir)..."
    docker logs -f $CONTAINER_NAME
    ;;
    
  status)
    echo "📊 Estado del contenedor:"
    docker ps -a | grep $CONTAINER_NAME
    ;;
    
  build)
    echo "🔨 Construyendo nueva imagen..."
    docker build -t $IMAGE_NAME .
    echo "✅ Imagen construida"
    ;;
    
  rebuild)
    echo "🔨 Reconstruyendo y reiniciando..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
    docker build -t $IMAGE_NAME .
    docker run -d --name $CONTAINER_NAME -p 8000:8000 --env-file .env $IMAGE_NAME
    echo "✅ Contenedor reconstruido y reiniciado"
    ;;
    
  clean)
    echo "🧹 Limpiando contenedor..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
    echo "✅ Contenedor limpiado"
    ;;
    
  shell)
    echo "🐚 Accediendo al shell del contenedor..."
    docker exec -it $CONTAINER_NAME bash
    ;;
    
  *)
    echo "🐳 OCGN Órdenes Backend - Docker Manager"
    echo ""
    echo "Uso: $0 {comando}"
    echo ""
    echo "Comandos disponibles:"
    echo "  start    - Inicia el contenedor"
    echo "  stop     - Detiene el contenedor"
    echo "  restart  - Reinicia el contenedor"
    echo "  logs     - Muestra los logs en tiempo real"
    echo "  status   - Muestra el estado del contenedor"
    echo "  build    - Construye la imagen Docker"
    echo "  rebuild  - Reconstruye y reinicia todo"
    echo "  clean    - Limpia el contenedor"
    echo "  shell    - Accede al shell del contenedor"
    echo ""
    echo "Ejemplos:"
    echo "  $0 start"
    echo "  $0 logs"
    echo "  $0 rebuild"
    exit 1
    ;;
esac
