const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles,
  createArticle,
  deleteArticle
} = require('../controllers/articles');

// get all articles
articlesRouter.get('/', getArticles);
// post new article with parameters
articlesRouter.post('/', createArticle);
// delete article by id
articlesRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string()
      .required()
      .pattern(
        /^[0-9a-fA-F]{24}$/,
      ),
  }),
}), deleteArticle);

module.exports = articlesRouter;
