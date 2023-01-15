const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { notFoundError } = require('./utils/errors');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('/', (req, res) => notFoundError(res, 'Страница не найдена'));

app.use(errors());
app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message,
  } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));