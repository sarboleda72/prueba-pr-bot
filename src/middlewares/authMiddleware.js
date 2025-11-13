const ResponseModel = require('../models/Response');
const {
  verifyJWT,
  login,
} = require('./jwtMiddleware');

const LOGINAPI = async (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json(ResponseModel.set(400, 'Los campos usuario y clave son requeridos'));
  }

  try {
    const token = await login(usuario, clave);
    return res.status(200).json(ResponseModel.set(200, 'Autenticado', token));
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json(ResponseModel.set(500, error || 'Ocurrio un error al iniciar sesión'));
  }
}

const isAuthenticatedMW = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json(ResponseModel.set(403, 'No se proporcionó un token'));
  }

  const token = authHeader.split(" ")[1];

  try {
    const verifyResponse = await verifyJWT(token);
    req.userData = verifyResponse.userInfo;

    if (verifyResponse && verifyResponse.jwt) {
      res.set('new_token', verifyResponse.jwt);
    }

    next();
  } catch (error) {
    return res.status(403).json(ResponseModel.set(403, error.message || 'No autorizado'));
  }
};

module.exports = {
  isAuthenticatedMW,
  loginAPI,
};