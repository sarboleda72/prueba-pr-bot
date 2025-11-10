# 📋 Resumen de Errores Esperados

## ✅ Carpeta `correct/`

### Archivos:
- ✅ `services/user-service.js` - Nombre en kebab-case
- ✅ `controllers/auth-controller.js` - Nombre en kebab-case
- ✅ `models/User.js` - PascalCase en models/ (permitido)
- ✅ `utils/helpers.js` - Nombre en kebab-case
- ✅ `config/app-config.js` - Nombre en kebab-case

### Código:
- ✅ Variables en camelCase
- ✅ Funciones en camelCase
- ✅ Clases en PascalCase
- ✅ Constantes literales en UPPER_SNAKE_CASE
- ✅ Comentarios en español

**Errores esperados: 0**

---

## ❌ Carpeta `incorrect/`

### Archivos:
- ❌ `services/user.service.js` - Tiene PUNTO en el nombre
- ❌ `controllers/auth_controller.js` - Usa snake_case
- ❌ `database/Product.js` - PascalCase fuera de models/
- ❌ `utils/string.utils.helper.js` - Múltiples puntos
- ❌ `.env` - Archivo de entorno en el repo

### Código en `user.service.js`:
- ❌ Constante `apiBaseUrl` sin UPPER_SNAKE_CASE
- ❌ Constante `maxRetries` sin UPPER_SNAKE_CASE
- ❌ Variable `base_url` en snake_case
- ❌ Función `get_active_users` en snake_case
- ❌ Variable `active_users` en snake_case
- ❌ Variable `user_count` en snake_case
- ❌ Y más...

### Código en `auth_controller.js`:
- ❌ Constante `default_timeout` sin UPPER_SNAKE_CASE
- ❌ Constante `max_attempts` sin UPPER_SNAKE_CASE
- ❌ Clase `auth_controller` en snake_case
- ❌ Variable `user_email` en snake_case
- ❌ Función `handle_login` en snake_case
- ❌ Y más...

### Código en `string.utils.helper.js`:
- ❌ Constante `max_length` sin UPPER_SNAKE_CASE
- ❌ Función `validate_string_length` en snake_case
- ❌ Clase `string_helper` en snake_case
- ❌ Y más...

**Errores esperados: ~40+**

---

## ⚠️ Carpeta `mixed/`

### Archivos:
- ✅ `services/product-service.js` - Nombre correcto
- ❌ `controllers/order.controller.js` - Tiene PUNTO
- ✅ `utils/validation-helpers.js` - Nombre correcto

### Código en `product-service.js`:
- ✅ Clase `ProductService` correcta
- ✅ Constante `API_ENDPOINT` correcta
- ❌ Constante `timeout` sin UPPER_SNAKE_CASE
- ❌ Variable `request_timeout` en snake_case
- ❌ Variable `product_list` en snake_case
- ❌ Variable `active_products` en snake_case

### Código en `order.controller.js`:
- ❌ Nombre de archivo con punto
- ✅ Código interno mayormente correcto

### Código en `validation-helpers.js`:
- ✅ Función `validatePassword` correcta
- ❌ Constante `maxPasswordLength` sin UPPER_SNAKE_CASE
- ❌ Variable `password_length` en snake_case
- ❌ Función `validate_phone_number` en snake_case

**Errores esperados: ~12**

---

## 📊 Totales Esperados

| Categoría | Correcto | Incorrecto | Mixto | **Total** |
|-----------|----------|------------|-------|-----------|
| **Archivos con errores de nombre** | 0 | 5 | 1 | **6** |
| **Errores de código** | 0 | ~35 | ~10 | **~45** |
| **Archivos sensibles (.env)** | 0 | 1 | 0 | **1** |
| **TOTAL ERRORES** | **0** | **~41** | **~11** | **~52** |

---

## 🎯 Cómo usar este proyecto

### 1. Análisis local completo:
```bash
cd ..
node test/test-analyzer.js test-project
```

### 2. Análisis de carpeta específica:
```bash
node test/test-analyzer.js test-project/incorrect
node test/test-analyzer.js test-project/correct
node test/test-analyzer.js test-project/mixed
```

### 3. Subir a GitHub y crear PR:
1. Crear repo nuevo en GitHub
2. Subir este proyecto
3. Instalar "PR Code Reviewer - APP"
4. Crear PR con cambios
5. Ver comentarios del bot

---

## ✨ Propósito

Este proyecto sirve para:
- ✅ Validar que el bot detecta TODOS los errores
- ✅ Verificar que NO da falsos positivos en código correcto
- ✅ Demostrar ejemplos claros de buenas/malas prácticas
- ✅ Entrenar al equipo en las convenciones de código
- ✅ Testing end-to-end del PR Code Reviewer

---

**Última actualización:** Noviembre 2025
