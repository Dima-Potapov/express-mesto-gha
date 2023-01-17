const jwt = require('jsonwebtoken');
const CastError = require('../utils/errors');
require('dotenv')
  .config();

const { JWT_SECRET, NODE_ENV = 'dev' } = process.env;

module.exports = (req, res, next) => {
  const jwtKey = req.cookies.jwt;

  if (!jwtKey) throw new CastError('Необходима авторизация', 401);

  let payload;

  try {
    payload = jwt.verify(jwtKey, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new CastError('Авторизация не пройдена', 401);
  }

  req.user = payload;

  return next();
};
