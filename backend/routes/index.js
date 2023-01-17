const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const CastError = require('../utils/errors');
const { linkRegex } = require('../utils/regexTemplates');
const {
  login,
  createUser,
  signOut,
  successfulAuth,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
  }),
}), createUser);

router.get('/check-auth', auth, successfulAuth);
router.delete('/signout', auth, signOut);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/', () => {
  throw new CastError('Страница не найдена', 404);
});

module.exports = router;
