const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {
  errors,
} = require('celebrate');
const { errorHandler } = require('./middlewares/errorsHandler');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
