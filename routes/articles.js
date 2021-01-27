const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

// get all articles
articlesRouter.get('/', getArticles);
// post new article with parameters
articlesRouter.post('/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().pattern(
        // eslint-disable-next-line no-useless-escape
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      ),
      image: Joi.string(),
    }),
  }), createArticle);
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
