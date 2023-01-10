const User = require('../models/user');
const {
  validationErrorAnswer,
  notFoundErrorAnswer,
  defaultErrorAnswer
} = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about , avatar } = req.body;

  if (!name || !about || !avatar) return validationErrorAnswer(res, "Переданы некорректные данные при создании пользователя");

  User.create({ name, about , avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") return validationErrorAnswer(res, "Переданы некорректные данные при создании пользователя");

      defaultErrorAnswer(res)
    });
}
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => defaultErrorAnswer(res));
}

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) return notFoundErrorAnswer(res, "Пользователь по указанному _id не найден");

      res.status(200).send(user)
    })
    .catch(() => defaultErrorAnswer(res));
}

const updateUser = (req, res) => {
  const { name, about , avatar } = req.body;
  const { _id: userId } = req.user;

  if (!name || !about || !avatar) return validationErrorAnswer(res, "Переданы некорректные данные при создании пользователя");

  User.findByIdAndUpdate(
    userId,
    { name, about , avatar},
    {
      new: true,
      runValidators: true,
      upsert: false
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "CastError") return notFoundErrorAnswer(res, "Пользователь по указанному _id не найден");
      if (error.name === "ValidationError") return validationErrorAnswer(res, "Переданы некорректные данные при обновлении профиля");

      defaultErrorAnswer(res);
    });
}

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  if (!avatar) return validationErrorAnswer(res, "Переданы некорректные данные при обновлении аватара");

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "CastError") return notFoundErrorAnswer(res, "Пользователь по указанному _id не найден");
      if (error.name === "ValidationError") return validationErrorAnswer(res, "Переданы некорректные данные при обновлении аватара");

      defaultErrorAnswer(res);
    });
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser
}
