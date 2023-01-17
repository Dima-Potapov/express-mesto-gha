const { Schema, model } = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { linkRegex } = require('../utils/regexTemplates');

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => linkRegex.test(v),
      message: 'Неправильный формат Url',
    },
  },
  email: {
    type: String,
    unique: true,
    validator: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат Email',
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = model('user', userSchema);
