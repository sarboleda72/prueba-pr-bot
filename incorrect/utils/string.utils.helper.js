// ❌ EJEMPLO INCORRECTO
// Archivo con múltiples puntos: string.utils.helper.js
// Constantes y funciones con nomenclatura incorrecta

const max_length = 100; // ❌ Constante sin UPPER_SNAKE_CASE
const min_length = 1; // ❌ Constante sin UPPER_SNAKE_CASE

/**
 * Valida longitud de string
 */
function validate_string_length(input_string) { // ❌ Función en snake_case
  const string_length = input_string.length; // ❌ Variable en snake_case
  const is_valid = string_length >= min_length && string_length <= max_length; // ❌ Variable en snake_case
  
  return is_valid;
}

/**
 * Convierte a mayúsculas
 */
function convert_to_uppercase(text_input) { // ❌ Función en snake_case
  const uppercase_text = text_input.toUpperCase(); // ❌ Variable en snake_case
  return uppercase_text;
}

/**
 * Clase helper incorrecta
 */
class string_helper { // ❌ Clase en snake_case
  constructor() {
    this.default_value = ''; // ❌ Propiedad en snake_case
  }

  process_string(input) { // ❌ Método en snake_case
    return input.trim();
  }
}

module.exports = {
  max_length,
  min_length,
  validate_string_length,
  convert_to_uppercase,
  string_helper
};
