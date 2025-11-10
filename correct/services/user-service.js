// ✅ EJEMPLO CORRECTO
// Archivo con nombre en kebab-case
// Variables en camelCase
// Comentarios en español
// Constantes en UPPER_SNAKE_CASE

const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

/**
 * Servicio para gestionar usuarios
 * Maneja operaciones CRUD de usuarios
 */
class UserService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.maxRetries = MAX_RETRY_ATTEMPTS;
  }

  /**
   * Obtiene todos los usuarios activos
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getActiveUsers() {
    const activeUsers = await this.fetchUsers({ status: 'active' });
    return activeUsers;
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      isActive: true
    };

    return await this.saveUser(newUser);
  }

  /**
   * Valida el formato del email
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  async fetchUsers(filters) {
    // Implementación de fetch
    return [];
  }

  async saveUser(user) {
    // Implementación de guardado
    return user;
  }
}

module.exports = UserService;
