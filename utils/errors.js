const validationErrorAnswer = (res, message = null) => res.status(400).send({ message: message ?? 'Переданы некорректные данные' });
const notFoundErrorAnswer = (res, message = null) => res.status(404).send({ message: message ?? 'Данные не найдены' });
const defaultErrorAnswer = (res, message = null) => res.status(500).send({ message: message ?? 'Произошла ошибка' });

module.exports = {
  validationErrorAnswer,
  notFoundErrorAnswer,
  defaultErrorAnswer
}
