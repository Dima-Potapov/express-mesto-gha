const jwt = require('jsonwebtoken');
require('dotenv')
  .config();

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const jwtKey = req.cookies.jwt;

  if (!jwtKey) {
    const error = new Error('Необходима авторизация');

    error.statusCode = 401;

    return next(error);
  }

  let payload;

  try {
    payload = jwt.verify(jwtKey, JWT_SECRET);
  } catch (err) {
    err.statusCode = 401;

    return next(err);
  }

  req.user = payload;

  return next();
};
