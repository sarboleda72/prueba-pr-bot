# 📘 Instrucciones personalizadas para GitHub Copilot Code Review

Estas reglas se aplican a todos los PRs de este repositorio:

---

## ✏️ Estilo del código
- Todo el código fuente debe estar escrito en **inglés** (nombres de variables, funciones, clases, etc).
- Si detectas palabras en español en el código, sugiere reemplazarlas por nombres descriptivos en inglés.

## 💬 Comentarios en el código
- Todos los comentarios (`//`, `/* ... */`, `#`, etc.) deben estar escritos en **español**.
- Los comentarios deben explicar claramente la intención del código, no repetir lo que hace.

## 🧩 Documentación mínima
- Cada función o clase debe tener al menos un comentario que describa su propósito.
- Si no hay comentarios suficientes, sugiere agregarlos.

## ⚠️ Buenas prácticas
- Usa nombres de variables consistentes y legibles.
- Evita abreviaciones confusas o palabras en Spanglish.
- Promueve el uso de verbos en infinitivo para funciones (e.g. `getUserData`, `calculateTotal`).

## 🏛️ Arquitectura de software
- Verifica que cada capa respete su responsabilidad específica:
  - **Routes**: solo definir rutas y endpoints, sin lógica de negocio.
  - **Controllers**: gestionar peticiones HTTP, validaciones de entrada y respuestas, sin lógica de negocio compleja.
  - **Services**: contener la lógica de negocio y orquestación.
  - **Models/Repositories**: gestionar acceso a datos y persistencia.
- Detecta violaciones de separación de capas (e.g. lógica de negocio en controllers, acceso directo a BD desde routes).
- Sugiere refactorización cuando una capa invada responsabilidades de otra.

---

Gracias Copilot 🤖
