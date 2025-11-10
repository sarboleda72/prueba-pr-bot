// ❌ EJEMPLO INCORRECTO
// Archivo con PUNTO en el nombre: user.service.js (debería ser user-service.js)
// Variables en snake_case (incorrecto)
// Constantes sin UPPER_SNAKE_CASE

const apiBaseUrl = 'https://api.example.com'; // ❌ Debería ser API_BASE_URL
const maxRetries = 3; // ❌ Debería ser MAX_RETRIES

/**
 * Servicio de usuarios con errores de nomenclatura
 */
class UserService {
  constructor() {
    this.base_url = apiBaseUrl; // ❌ snake_case
    this.max_retries = maxRetries; // ❌ snake_case
  }

  /**
   * Obtiene usuarios activos
   */
  async get_active_users() { // ❌ Función en snake_case
    const active_users = await this.fetch_users({ status: 'active' }); // ❌ Variable en snake_case
    const user_count = active_users.length; // ❌ Variable en snake_case
    
    return active_users;
  }

  /**
   * Crea un usuario
   */
  async create_user(user_data) { // ❌ Función y parámetro en snake_case
    const new_user = { // ❌ Variable en snake_case
      first_name: user_data.first_name, // ❌ Propiedades en snake_case
      last_name: user_data.last_name,
      email_address: user_data.email,
      is_active: true
    };

    return await this.save_user(new_user);
  }

  async fetch_users(filters) { // ❌ Función en snake_case
    return [];
  }

  async save_user(user) { // ❌ Función en snake_case
    return user;
  }
}

module.exports = UserService;
