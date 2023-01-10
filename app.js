const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63bc766871e1dd8f56788dda'
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
