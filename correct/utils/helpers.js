// ✅ EJEMPLO CORRECTO
// Utilidades con funciones helper en camelCase
// Constantes en UPPER_SNAKE_CASE

const HASH_ROUNDS = 10;
const TOKEN_EXPIRY_HOURS = 24;
const MAX_LOGIN_ATTEMPTS = 5;

/**
 * Formatea una fecha al formato local
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Genera un ID único
 * @returns {string} ID generado
 */
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomNum}`;
}

/**
 * Valida si una cadena está vacía
 * @param {string} str - Cadena a validar
 * @returns {boolean} True si está vacía
 */
function isEmptyString(str) {
  return !str || str.trim().length === 0;
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
function capitalizeWords(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports = {
  HASH_ROUNDS,
  TOKEN_EXPIRY_HOURS,
  MAX_LOGIN_ATTEMPTS,
  formatDate,
  generateUniqueId,
  isEmptyString,
  capitalizeWords
};
