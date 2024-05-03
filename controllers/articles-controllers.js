const {
  fetchArticleById,
  fetchAllArticles,
  checkIfArticleExists,
  patchArticle,
  fetchArticleByTopic,
  addNewArticle,
} = require("../models/articles-models");

function getArticleById(request, response, next) {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => next(error));
}

function getArticles(request, response, next) {
  const { sort_by = "created_at", order = "desc" } = request.query;
  const validQuerys = ["topic", "author"];

  const query = Object.keys(request.query)[0];
  const queryValue = Object.values(request.query)[0];

  if (validQuerys.includes(query)) {
    return fetchArticleByTopic(query, queryValue)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    fetchAllArticles(sort_by, order)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((error) => next(error));
  }
}

function getPatchedArticle(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  patchArticle(article_id, inc_votes)
    .then((patchedArticle) => {
      response.status(200).send({ patchedArticle });
    })
    .catch((error) => next(error));
}

function getNewArticle(request, response, next) {
  const { title, topic, author, body } = request.body;

  addNewArticle(title, topic, author, body)
    .then((newArticle) => {
      console.log(newArticle);
      response.status(201).send({ newArticle });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
}

module.exports = {
  getArticleById,
  getArticles,
  getPatchedArticle,
  getNewArticle,
};
