/**
 * @fileoverview Middleware de autenticación para el sistema Gomedisys
 * Maneja la creación y gestión de sesiones por prefijo de factura
 */

const authService = require('../services/auth.service');
const cheerio = require('cheerio');
const { getConnectionParamsByIpsName } = require('../utils/connectionParams.utils');

/**
 * Obtiene las cookies de sesión para una IPS específica
 * @async
 * @function getSessionCookie
 * @param {string} ipsName - Nombre de la IPS (ej: "Sogamoso", "Clinica Chia", etc.)
 * @returns {Promise<string[]>} Array de cookies de sesión con Domain configurado
 * @throws {Error} Si la autenticación falla
 * @description Ejecuta el flujo completo de autenticación:
 * 1. Obtiene parámetros de conexión según el nombre de la IPS
 * 2. Ejecuta loginSession para obtener cookies iniciales y token CSRF
 * 3. Ejecuta loginCommit con el accessProfile correcto
 * 4. Combina y configura las cookies finales con el dominio correcto
 * @example
 * const cookies = await getSessionCookie('Sogamoso');
 */
const getSessionCookie = async (ipsName) => {
  try {
    console.log('Generando Cookies');
    const connectionParams = getConnectionParamsByIpsName(ipsName);
    // const session = await authService.updateSession(connectionParams);
    const loginSession = await authService.loginSession();

    // 1. Extraer cookies y token del primer login
    const originalCookies = loginSession.headers['set-cookie'];
    if (!originalCookies || originalCookies.length === 0) {
      throw new Error('La respuesta no entrego las cookies');
    }
    const $ = cheerio.load(loginSession.data);
    const token = $('input[name="__RequestVerificationToken"]').val();

    // 2. Hacer loginCommit con cookies y token extraídos
    const accessProfile = `${connectionParams.companyId}-${connectionParams.officeId}`;
    const loginCommitResponse = await authService.loginCommit(token, originalCookies, accessProfile);

    // 3. Extraer las cookies finales del loginCommit
    let finalCookies = loginCommitResponse.headers['set-cookie'];
    if (!finalCookies || finalCookies.length === 0) {
      throw new Error('LoginCommit no entregó cookies');
    }

    finalCookies = [...finalCookies, ...originalCookies]; 

    // 4. Agregar Domain solo a las cookies finales
    const cookiesWithDomain = finalCookies.map(cookie => {
      if (cookie.includes('Domain=')) {
        return cookie.replace(/Domain=[^;]+/, 'Domain=weliiavidanti.gomedisys.com');
      } else {
        return `${cookie}; Domain=weliiavidanti.gomedisys.com`;
      }
    });

    // 5. Retornar solo las cookies finales con Domain
    return cookiesWithDomain;

  } catch (error) {
    console.error('Failed to create new session:', error.message);
    throw { status: 401, message: 'Unauthorized. Failed to generate a new session.' };
  }
};

/**
 * Middleware de autenticación HTTP
 * @async
 * @function authMiddleware
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para continuar al siguiente middleware
 * @returns {Promise<void>} Continúa al siguiente middleware o devuelve error
 * @description Genera cookies de sesión y las adjunta a la petición
 * @deprecated Este middleware no se usa actualmente, se maneja por prefijo en el servicio
 */
const authMiddleware = async (req, res, next) => {
  try {
    const newCookie = await getSessionCookie();
    res.clearCookie('authSession');
    res.cookie('authSession', newCookie, { httpOnly: true, secure: true });
    req.sessionCookie = newCookie;
    next();
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = { authMiddleware, getSessionCookie };