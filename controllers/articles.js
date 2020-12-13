const bcrypt = require('bcrypt');
const Article = require('../models/article');

// constants
const {
  OK_CODE,
  CREATE_CODE
} = require('../utils/constants');

// errors
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// get all articles
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({});
    res.status(OK_CODE).send(articles);
  } catch (err) {
    next(err);
  }
};

// post new article with parameters
const createArticle = async (req, res, next) => {
  const { id } = req.user;
  const { keyword, title, text, date, source, link, image } = req.body;
  try {
    const article = await Article.create({ keyword, title, text, date, source, link, image, owner: id });
    if (!article) {
      throw new BadRequestError('Ошибка. Переданы некорректные данные');
    }
    res.status(CREATE_CODE).send({ article });
  } catch (err) {
    next(err)
  }
};

// delete article by id
const deleteArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const { id } = req.user;
  Article.findById(articleId)
    .select('+owner')
    .orFail(new NotFoundError('Ошибка. Нет карточки с таким id'))
    .then((article) => {
      // eslint-disable-next-line
      if (article.owner != id) {
        throw new ForbiddenError('Ошибка. Вы не можете удалять чужие карточки');
      } else {
        Article.findByIdAndRemove(articleId)
          .then((articleData) => res.send({ deletedArticle: articleData }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle
};