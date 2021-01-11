const rootRouter = require('express').Router();
const userRouter = require('./users');
const articlesRouter = require('./articles');

rootRouter.use('/users', userRouter);
rootRouter.use('/articles', articlesRouter);

module.exports = rootRouter;
