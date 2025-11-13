const { } = require("./authMiddleware");
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function login(username, password) {

  if (username != process.env.JWT_USER || password != process.env.JWT_PASSWORD) {
    throw 'Usuario o contraseña incorrectos';
  }
  
  const user = {
    id: "usuario interno",
    username: username
  };

  const token = jwt.sign({ userInfo: user }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRA });

  return token
}

async function verifyJWT(token) {
  let response = {};
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRETO);
    response.userInfo = decoded.userInfo;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw { message: 'JWT expirado. Por favor inicie sesión nuevamente' };
    }
    throw { message: 'El JWT es inválido' };
  }

  if (!response.userInfo?.id) {
    throw { message: 'El JWT es incorrecto' };
  }

  const expireDate = new Date(decoded.exp * 1000);
  const now = new Date();
  const diff = expireDate - now;
  const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);

  if (diffMins < 10) {
    response.jwt = jwt.sign(
      { userInfo: response.userInfo },
      process.env.JWT_SECRETO,
      { expiresIn: process.env.JWT_TIEMPO_EXPIRA }
    );
  }

  return response;
}

module.exports = {
  verifyJWT,
  login,
};