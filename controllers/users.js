const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const CastError = require('../utils/errors');

require('dotenv')
  .config();

const { JWT_SECRET = 'dev-secret' } = process.env;

const getAuthUser = (req, res) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => res.status(200)
      .send(user))
    .catch((error) => {
      if (error.name === 'CastError') throw new CastError('Пользователь по указанному _id не найден', 404);

      throw new CastError();
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
    .then((hash) => User.create(
      {
        name,
        about,
        avatar,
        email,
        password: hash,
      },
    ))

    .then((user) => res.status(201)
      .send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
    .catch((error) => {
      if (error.name === 'ValidationError') return next(new CastError('Переданы некорректные данные при создании пользователя', 400));
      if (error.code === 11000) return next(new CastError('Пользователь с таким email уже зарегистрирован', 409));

      return next(new CastError());
    });
};
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200)
      .send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) throw new CastError('Пользователь по указанному _id не найден', 404);

      return res.status(200)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') throw new CastError('Пользователь по указанному _id не найден', 400);

      next(error);
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
      if (error.name === 'CastError') throw new CastError('Пользователь по указанному _id не найден', 404);
      if (error.name === 'ValidationError') throw new CastError('Переданы некорректные данные при обновлении профиля', 400);

      next(error);
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
      if (error.name === 'CastError') throw new CastError('Пользователь по указанному _id не найден', 404);
      if (error.name === 'ValidationError') throw new CastError('Переданы некорректные данные при обновлении аватара', 400);

      next(error);
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
      if (!user) throw new CastError('Неправильные почта или пароль', 401);

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!user || !matched) throw new CastError('Неправильные почта или пароль', 401);

          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

          res
            .cookie('jwt', token, {
              maxAge: 604800,
              httpOnly: true,
              sameSite: true,
            })
            .status(200)
            .send({ message: 'Авторизация прошла успешно!' })
            .end();
        });
    })
    .catch(next);
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
