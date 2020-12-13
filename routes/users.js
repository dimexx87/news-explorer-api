const userRouter = require('express').Router();

const {
  getMeUser,
} = require('../controllers/users');

// get my user
userRouter.get('/me', getMeUser);

module.exports = userRouter;
