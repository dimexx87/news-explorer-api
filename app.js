require('dotenv').config();

// export from modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');

// export from project
const { requestLogger, errorLogger } = require('./middlewares/logger');
const BadRequestError = require('./errors/bad-request-err');
const auth = require('./middlewares/auth');
const { createUser, signin } = require('./controllers/users');
const rootRoutes = require('./routes/root');

const { PORT = 3000 } = process.env;
const app = express();

// local db connection
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

// request logger middleware
app.use(requestLogger);

// signup new user
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

// signin existing user
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

// routes protector
app.use(auth);

// protected routes
app.use('/', rootRoutes);
app.use('*', () => {
  throw new BadRequestError('Запрашиваемый ресурс не найден');
});

// error logger middleware
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
