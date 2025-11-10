// ⚠️ EJEMPLO MIXTO
// Archivo correcto: validation-helpers.js ✅
// Código con errores mixtos

const MIN_PASSWORD_LENGTH = 8; // ✅ Constante correcta
const maxPasswordLength = 128; // ❌ Constante sin UPPER_SNAKE_CASE

/**
 * Valida contraseña
 */
function validatePassword(password) { // ✅ Función correcta
  const password_length = password.length; // ❌ Variable en snake_case
  const hasMinLength = password_length >= MIN_PASSWORD_LENGTH; // ✅ Variable correcta
  const has_max_length = password_length <= maxPasswordLength; // ❌ Variable en snake_case

  return hasMinLength && has_max_length;
}

/**
 * Valida email
 */
function validateEmail(emailAddress) { // ✅ Función correcta
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ✅ Variable correcta
  return emailRegex.test(emailAddress);
}

/**
 * Valida número de teléfono
 */
function validate_phone_number(phone) { // ❌ Función en snake_case
  const phoneRegex = /^\+?[\d\s-()]+$/; // ✅ Variable correcta
  const is_valid = phoneRegex.test(phone); // ❌ Variable en snake_case
  return is_valid;
}

module.exports = {
  MIN_PASSWORD_LENGTH,
  maxPasswordLength,
  validatePassword,
  validateEmail,
  validate_phone_number
};
