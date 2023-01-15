const mongoose = require('mongoose');
const { linkRegex } = require('../utils/regexTemplates');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => linkRegex.test(v),
      message: 'Неправильный формат Url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('card', cardSchema);
