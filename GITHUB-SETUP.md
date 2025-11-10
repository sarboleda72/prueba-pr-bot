# 🚀 Cómo subir este proyecto a GitHub

## Paso 1: Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre del repo: `pr-code-reviewer-test-project`
3. Descripción: `Proyecto de prueba para validar PR Code Reviewer`
4. **Público** (para aprovechar GitHub Actions gratis)
5. ❌ NO inicialices con README (ya tenemos uno)
6. Click en **"Create repository"**

---

## Paso 2: Subir el proyecto

Desde la carpeta `test-project/`, ejecuta:

```bash
cd test-project

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: proyecto inicial de prueba para PR Code Reviewer

- ✅ Ejemplos correctos (correct/)
- ❌ Ejemplos incorrectos (incorrect/)
- ⚠️ Ejemplos mixtos (mixed/)
- 📋 Documentación de errores esperados
"

# Configurar rama principal
git branch -M main

# Agregar remote (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/pr-code-reviewer-test-project.git

# Push
git push -u origin main
```

---

## Paso 3: Instalar el GitHub App

1. Ve a tu repo recién creado
2. Settings → GitHub Apps
3. Busca "PR Code Reviewer - APP"
4. Install (si no está instalado ya)

---

## Paso 4: Crear un Pull Request de prueba

### Opción A: Desde GitHub (más fácil)

1. En tu repo, click en "Create new file"
2. Nombre: `test-change.js`
3. Contenido:
```javascript
const test_variable = 1; // ❌ Error: snake_case
```
4. Scroll abajo, selecciona **"Create a new branch"**
5. Nombre de branch: `test-pr`
6. Click **"Propose new file"**
7. Click **"Create pull request"**

### Opción B: Desde terminal

```bash
# Crear nueva branch
git checkout -b test-pr

# Agregar archivo con errores
echo "const test_var = 1;" > test-error.js
git add test-error.js
git commit -m "test: agregar archivo con errores"

# Push
git push origin test-pr

# Luego ve a GitHub y crea el PR desde la interfaz
```

---

## Paso 5: Ver resultados

1. Espera ~30 segundos
2. Ve al PR que creaste
3. Deberías ver un comentario del bot **"PR Code Reviewer - APP"**
4. El bot debería reportar:
   - ❌ Errores de naming
   - ❌ Errores de code style
   - 📋 Guía de corrección en español

---

## 🎯 Pruebas sugeridas

### Prueba 1: Archivo con nombre incorrecto
```bash
git checkout -b test-naming
echo "const x = 1;" > user.service.js  # ❌ Punto en el nombre
git add . && git commit -m "test: naming error"
git push origin test-naming
# Crear PR
```

**Resultado esperado:** Bot detecta punto en el nombre

---

### Prueba 2: Variables en snake_case
```bash
git checkout -b test-snake-case
cat > test-file.js << 'EOF'
const user_name = 'test';
const user_email = 'test@test.com';
EOF
git add . && git commit -m "test: snake_case variables"
git push origin test-snake-case
# Crear PR
```

**Resultado esperado:** Bot detecta variables en snake_case

---

### Prueba 3: Archivo .env
```bash
git checkout -b test-env
echo "API_KEY=secret123" > .env
git add .env && git commit -m "test: add .env file"
git push origin test-env
# Crear PR
```

**Resultado esperado:** Bot detecta archivo .env

---

### Prueba 4: Todo correcto
```bash
git checkout -b test-correct
cat > user-service.js << 'EOF'
const API_URL = 'https://api.com';

class UserService {
  async getUsers() {
    return [];
  }
}
EOF
git add . && git commit -m "test: código correcto"
git push origin test-correct
# Crear PR
```

**Resultado esperado:** Bot aprueba sin errores ✅

---

## 📊 Validar localmente antes de subir

```bash
# Desde la raíz del proyecto pr-code-reviewer
node test/test-project-validation.js
```

Esto debería mostrar:
- ✅ ~52 errores totales detectados
- ❌ 5+ errores de naming
- ❌ 35+ errores de code style
- ❌ 1 archivo .env detectado

---

## 🔧 Solución de problemas

### El bot no comenta en el PR

1. Verifica que el App esté instalado en el repo
2. Ve a Settings → GitHub Apps → PR Code Reviewer
3. Verifica que tenga permisos de:
   - ✅ Read access to metadata
   - ✅ Read and write access to pull requests

### El bot comenta pero no detecta errores

1. Verifica los logs de Azure:
   - https://pr-code-reviewer-hhd6dyeycqapb6c4.eastus-01.azurewebsites.net
2. Ve a Monitoring → Log stream
3. Busca errores en los logs

### Quiero agregar más pruebas

1. Edita archivos en `incorrect/` o `mixed/`
2. Crea un PR
3. Valida que el bot detecte los cambios

---

## ✨ ¡Listo!

Ahora tienes un proyecto completo de pruebas para validar todas las reglas del PR Code Reviewer. 

**Comparte este repo con tu equipo** para que vean ejemplos de código correcto vs incorrecto.

---

**Documentación:** [../README.md](../README.md)  
**Errores esperados:** [EXPECTED-ERRORS.md](EXPECTED-ERRORS.md)
