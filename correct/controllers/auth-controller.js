// ✅ EJEMPLO CORRECTO
// Controlador con nombre en kebab-case
// Funciones en camelCase
// Comentarios en español

const UserService = require('../services/user-service');

const userService = new UserService();

/**
 * Controlador de autenticación de usuarios
 */
class AuthController {
  /**
   * Maneja el login de usuarios
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async handleLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userService.validateCredentials(email, password);
      const token = this.generateToken(user);

      res.json({
        success: true,
        token: token,
        user: user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  }

  /**
   * Maneja el logout de usuarios
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async handleLogout(req, res) {
    const userId = req.user.id;
    
    await this.invalidateToken(userId);
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  }

  /**
   * Genera un token JWT para el usuario
   * @param {Object} user - Datos del usuario
   * @returns {string} Token generado
   */
  generateToken(user) {
    // Implementación de generación de token
    return 'token-example';
  }

  async invalidateToken(userId) {
    // Implementación de invalidación
    return true;
  }
}

module.exports = new AuthController();
