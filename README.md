# 🧪 Test Project - PR Code Reviewer

Este es un proyecto de prueba para validar todas las reglas del PR Code Reviewer.

## 📁 Estructura del proyecto

```
test-project/
├── ✅ correct/          # Ejemplos de código CORRECTO
├── ❌ incorrect/        # Ejemplos de código INCORRECTO
├── 🔧 mixed/            # Ejemplos mixtos (algunos errores)
└── README.md
```

## 🎯 Reglas que se validan

### 1. **Naming Convention (Nombres de archivos y carpetas)**
- ✅ kebab-case preferido: `user-service.js`
- ✅ camelCase permitido: `userService.js`
- ✅ PascalCase SOLO en `models/`: `User.js`
- ❌ snake_case: `user_service.js`
- ❌ Puntos en nombres: `user.service.js`
- ❌ Espacios o caracteres especiales

### 2. **Code Style (Estilo de código JavaScript)**
- ✅ Variables/funciones: camelCase
- ✅ Clases: PascalCase
- ✅ Constantes literales: UPPER_SNAKE_CASE
- ❌ Variables en snake_case
- ❌ Constantes sin UPPER_SNAKE_CASE
- 🔧 Excepciones: `require()`, `sequelize.define()`, `mongoose.model()`, `new`

### 3. **Gitignore Analyzer**
- ✅ Archivo `.gitignore` existe
- ✅ Incluye: `node_modules/`, `.env*`, `dist/`

### 4. **Env Analyzer**
- ❌ Archivos `.env` en el repositorio
- ❌ Archivos `.env.local`, `.env.production`

### 5. **Dependency Analyzer**
- ❌ Carpeta `node_modules/` en el repo
- ❌ Carpetas `.venv/`, `venv/`, `__pycache__/`

## 🚀 Cómo probar

### Opción 1: Análisis local
```bash
cd ..
node test/test-analyzer.js test-project
```

### Opción 2: Crear PR en GitHub
1. Sube este proyecto a un repositorio
2. Instala el GitHub App "PR Code Reviewer"
3. Crea un PR con cambios
4. El bot comentará automáticamente

## 📊 Resultados esperados

### En carpeta `correct/`
- ✅ Todos los archivos deberían pasar las validaciones
- ✅ Sin errores de naming
- ✅ Sin errores de code style

### En carpeta `incorrect/`
- ❌ Detectar errores de naming (puntos, snake_case)
- ❌ Detectar errores de code style
- ❌ Archivos `.env` detectados
- ❌ `node_modules/` detectado

### En carpeta `mixed/`
- ⚠️ Algunos archivos correctos
- ❌ Algunos archivos con errores

## 🎓 Propósito

Este proyecto sirve para:
1. **Probar** que todas las reglas funcionan
2. **Demostrar** ejemplos claros de buenas/malas prácticas
3. **Validar** el bot antes de usarlo en proyectos reales
4. **Compartir** como referencia de convenciones

---

**Creado para probar PR Code Reviewer** 🤖
