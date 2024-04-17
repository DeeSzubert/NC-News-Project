const {
  fetchArticleById,
  fetchAllArticles,
  checkIfArticleExists,
  patchArticle,
  fetchArticleByTopic,
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
  const { topic } = request.query;

  if (topic) {
    return fetchArticleByTopic(topic)
      .then((articles) => {
        response.status(200).send(articles);
      })
      .catch((error) => next(error));
  } else {
    fetchAllArticles()
      .then((articles) => {
        response.status(200).send(articles);
      })
      .catch((error) => next(error));
  }
}

function getPatchedArticle(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  checkIfArticleExists(article_id)
    .then((result) => {
      return patchArticle(article_id, inc_votes);
    })
    .then((patchedArticle) => {
      response.status(200).send(patchedArticle);
    })
    .catch((error) => next(error));
}

function getArticlesByTopic(request, response, next) {
  const { topic } = request.query;
  console.log(topic);
}
module.exports = {
  getArticleById,
  getArticles,
  getPatchedArticle,
  getArticlesByTopic,
};
