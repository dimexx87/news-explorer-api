const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign');

// constants
const {
  OK_CODE,
  CREATE_CODE,
  SALT_ROUND,
} = require('../utils/constants');

// errors
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

// get my user
const getMeUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Ошибка. Нет пользователя с таким id');
    }
    res.status(OK_CODE).send(user);
  } catch (err) {
    next(err);
  }
};

// create new user
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Не указаны имя, почта или пароль');
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой пользователь уже существует');
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => {
      User.create({ email, password: hash })
        .then(({ _id }) => res.status(CREATE_CODE).send({ name, email, _id }))
        .catch(next);
    })
    .catch(next);
};

// signin registered user
const signin = (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError('Не указаны почта или пароль');
    }
    User.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }
        bcrypt.compare(password, user.password).then((matched) => {
          if (matched) {
            const token = jwtSign(user._id);
            const { _id } = user;
            return res.send({ token, _id });
          }
          throw new UnauthorizedError('Неправильные почта или пароль');
        });
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMeUser,
  createUser,
  signin,
};
