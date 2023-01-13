const User = require('../models/user');
const {
  validationErrorAnswer,
  notFoundErrorAnswer,
  defaultErrorAnswer,
} = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') return validationErrorAnswer(res, 'Переданы некорректные данные при создании пользователя');

      return defaultErrorAnswer(res);
    });
};
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => defaultErrorAnswer(res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) return notFoundErrorAnswer(res, 'Пользователь по указанному _id не найден');

      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') return validationErrorAnswer(res, 'Пользователь по указанному _id не найден');

      return defaultErrorAnswer(res);
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'CastError') return notFoundErrorAnswer(res, 'Пользователь по указанному _id не найден');
      if (error.name === 'ValidationError') return validationErrorAnswer(res, 'Переданы некорректные данные при обновлении профиля');

      return defaultErrorAnswer(res);
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'CastError') return notFoundErrorAnswer(res, 'Пользователь по указанному _id не найден');
      if (error.name === 'ValidationError') return validationErrorAnswer(res, 'Переданы некорректные данные при обновлении аватара');

      return defaultErrorAnswer(res);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser,
};
