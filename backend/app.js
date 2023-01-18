const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {
  errors,
} = require('celebrate');
const { errorHandler } = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://dimap.domainname.student.nomoredomains.rocks',
    'https://dimap.domainname.student.nomoredomains.rocks',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   const { origin } = req.headers;
//
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//
//   next();
// });

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
