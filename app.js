const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { notFoundErrorAnswer } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63bc766871e1dd8f56788dda',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((err, req, res, next) => {
  if (err.name instanceof 'NotFound') {
    notFoundErrorAnswer(res, 'Страница не найдена');
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
