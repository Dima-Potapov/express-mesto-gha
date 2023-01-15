const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  validationError,
  notFoundError,
  defaultError,
  authError,
  customError,
} = require('../utils/errors');

require('dotenv').config();

const { JWT_SECRET } = process.env;

const getAuthUser = (req, res, next) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => res.status(200)
      .send(user))
    .catch((error) => {
      if (error.name === 'CastError') return next(notFoundError('Пользователь по указанному _id не найден'));

      return next(defaultError());
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201)
      .send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') return next(validationError('Переданы некорректные данные при создании пользователя'));
      if (error.code === 11000) return next(customError('Пользователь с таким email уже зарегистрирован', 409));

      next(defaultError());
    });
};
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200)
      .send(users))
    .catch(() => next(defaultError()));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) return next(notFoundError('Пользователь по указанному _id не найден'));

      return res.status(200)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') return next(validationError('Пользователь по указанному _id не найден'));

      next(defaultError());
    });
};

const updateUser = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.status(200)
      .send(user))
    .catch((error) => {
      if (error.name === 'CastError') return next(notFoundError('Пользователь по указанному _id не найден'));
      if (error.name === 'ValidationError') return next(validationError('Переданы некорректные данные при обновлении профиля'));

      next(defaultError());
    });
};

const updateAvatarUser = (req, res, next) => {
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
    .then((user) => res.status(200)
      .send(user))
    .catch((error) => {
      if (error.name === 'CastError') return next(notFoundError('Пользователь по указанному _id не найден'));
      if (error.name === 'ValidationError') return next(validationError('Переданы некорректные данные при обновлении аватара'));

      next(defaultError());
    });
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!bcrypt.compare(password, user.password)) return next(authError('Неправильные почта или пароль'));

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 604800,
          httpOnly: true,
          sameSite: true,
        });

      delete user.password;

      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(authError('Неправильные почта или пароль'));

      next(defaultError(res));
    });
};

module.exports = {
  getAuthUser,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser,
  login,
};
