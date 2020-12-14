require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const BadRequestError = require('./errors/bad-request-err');

const auth = require('./middlewares/auth');
const { createUser, signin } = require('./controllers/users');
const { PORT = 3000 } = process.env;

const rootRoutes = require('./routes/root');

const app = express();

const mongoDbUrl = 'mongodb://127.0.0.1:27017/articledb';

const mongoConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(mongoDbUrl, mongoConnectOptions);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(3).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(3),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(3),
    }),
  }),
  signin,
);

app.use(auth);
app.use('/', rootRoutes);
app.use('*', () => {
  throw new BadRequestError('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? `На сервере произошла ошибка ${err}` : message,
  });
});

app.listen(PORT);