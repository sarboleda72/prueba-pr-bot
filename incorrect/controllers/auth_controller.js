// ❌ EJEMPLO INCORRECTO
// Archivo con snake_case: auth_controller.js (debería ser auth-controller.js)
// Múltiples errores de nomenclatura

const user_service = require('../services/user.service'); // ❌ Variable en snake_case

const default_timeout = 5000; // ❌ Constante sin UPPER_SNAKE_CASE
const max_attempts = 3; // ❌ Constante sin UPPER_SNAKE_CASE

/**
 * Controlador de autenticación con errores
 */
class auth_controller { // ❌ Clase en snake_case
  constructor() {
    this.user_service = user_service; // ❌ Propiedad en snake_case
    this.login_attempts = 0; // ❌ Propiedad en snake_case
  }

  /**
   * Maneja login
   */
  async handle_login(req, res) { // ❌ Método en snake_case
    const user_email = req.body.email; // ❌ Variable en snake_case
    const user_password = req.body.password; // ❌ Variable en snake_case

    try {
      const auth_token = await this.generate_token(); // ❌ Variable en snake_case
      const user_data = await this.get_user_data(user_email); // ❌ Variable en snake_case

      res.json({
        success: true,
        auth_token: auth_token,
        user_data: user_data
      });
    } catch (error) {
      this.login_attempts++; // ❌ Propiedad en snake_case
      res.status(401).json({ success: false });
    }
  }

  async generate_token() { // ❌ Método en snake_case
    const token_value = 'abc123'; // ❌ Variable en snake_case
    return token_value;
  }

  async get_user_data(email) { // ❌ Método en snake_case
    return {};
  }
}

module.exports = new auth_controller();
