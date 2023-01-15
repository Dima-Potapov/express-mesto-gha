const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getAuthUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL'),
  }),
}), updateAvatarUser);

module.exports = router;
