/**
 * @fileoverview Servicio de autenticación para el sistema Gomedisys
 * Maneja el flujo de login en dos pasos: sesión inicial y commit
 */

const axios = require('axios');

/**
 * Actualiza la sesión con credenciales específicas
 * @async
 * @function updateSession
 * @param {Object} credentials - Credenciales de autenticación
 * @param {string} [credentials.username] - Nombre de usuario
 * @param {string} [credentials.password] - Contraseña
 * @param {string} [credentials.officeId] - ID de la oficina
 * @param {string} [credentials.companyId] - ID de la empresa
 * @param {string} [credentials.connectionId] - ID de conexión
 * @returns {Promise<Object>} Respuesta HTTP de la autenticación
 * @throws {Error} Si la autenticación falla
 * @description Método alternativo de autenticación (no usado actualmente)
 * @deprecated Usar loginSession + loginCommit en su lugar
 */
const updateSession = async (credentials) => {
  const url = process.env.AUTH_API_URL;

  const params = {
    UserName: credentials.username || process.env.AUTH_USERNAME,
    passwrod: credentials.password || process.env.AUTH_PASSWORD,
    idOffice: credentials.officeId || process.env.AUTH_OFFICE_ID,
    idCompany: credentials.companyId || process.env.AUTH_COMPANY_ID,
    idConnection: credentials.connectionId || process.env.AUTH_CONNECTION_ID,
  };

  const response = await axios.post(url, null, { params, withCredentials: true });
  return response;
};

/**
 * Ejecuta el login inicial para obtener cookies y token CSRF
 * @async
 * @function loginSession
 * @returns {Promise<Object>} Respuesta HTTP con cookies en headers y HTML con token
 * @throws {Error} Si no se reciben cookies o falla la petición
 * @description Primer paso del flujo de autenticación. Envía credenciales hasheadas
 * y obtiene cookies de sesión inicial más el token CSRF necesario para loginCommit.
 * @example
 * const loginResponse = await loginSession();
 * const cookies = loginResponse.headers['set-cookie'];
 */
const loginSession = async () => {
  const url = process.env.URL_LOGIN;

  const params = new URLSearchParams();
  params.append('PasswordHash', process.env.AUTH_PASSWORD_HASH);
  params.append('Salt', process.env.SALT);
  params.append('UserName', process.env.AUTH_USERNAME);

  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    withCredentials: true
  });

  // Extrae cookies y token
  const cookies = response.headers['set-cookie'];
  if (!cookies || cookies.length === 0) throw new Error('No se recibieron cookies en el login inicial');

  // Si necesitas el token aquí, extrae el HTML y búscalo con cheerio (hazlo en el middleware si prefieres)
  return response;
};

/**
 * Completa el proceso de login enviando el token CSRF y seleccionando perfil
 * @async
 * @function loginCommit
 * @param {string} token - Token CSRF obtenido del loginSession
 * @param {string|string[]} cookies - Cookies de sesión del loginSession
 * @param {string} accessProfile - Perfil de acceso en formato "companyId-officeId"
 * @returns {Promise<Object>} Respuesta HTTP con cookies finales de autenticación
 * @throws {Error} Si falla el commit o no se reciben cookies finales
 * @description Segundo paso del flujo de autenticación. Usa las cookies iniciales
 * y el token CSRF para completar el login y obtener las cookies finales de sesión.
 * @example
 * const commitResponse = await loginCommit(token, cookies, '1-8');
 * const finalCookies = commitResponse.headers['set-cookie'];
 */
const loginCommit = async (token, cookies, accessProfile) => {
  const url = process.env.URL_LOGIN_COMMIT;

  // Solo pares clave=valor, sin atributos extra
  const cookieHeader = Array.isArray(cookies)
    ? cookies
        .map(c => c.split(';')[0])
        .filter(c => c && !c.startsWith('goPartitionKey='))
        .join('; ')
    : cookies;

  const response = await axios.post(url, new URLSearchParams({
    accessProfile,
    __RequestVerificationToken: token
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader
    },
    withCredentials: true,
    maxRedirects: 0 
  }).catch(error => {
    if (error.response) return error.response;
    throw error;
  });

  return response;
};

module.exports = {
  updateSession,
  loginSession,
  loginCommit
};