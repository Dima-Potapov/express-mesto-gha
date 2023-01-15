const validationError = (message = 'Переданы некорректные данные') => {
  const err = new Error(message);

  err.statusCode = 400;

  return err;
};
const notFoundError = (message = 'Данные не найдены') => {
  const err = new Error(message);

  err.statusCode = 404;

  return err;
};
const defaultError = (message = 'Произошла ошибка') => {
  const err = new Error(message);

  err.statusCode = 500;

  return err;
};
const authError = (message = 'Необходима авторизация') => {
  const err = new Error(message);

  err.statusCode = 401;

  return err;
};
const customError = (message = 'Произошла ошибка', code = 500) => {
  const err = new Error(message);

  err.statusCode = code;

  return err;
};

module.exports = {
  validationError,
  notFoundError,
  defaultError,
  authError,
  customError,
};
