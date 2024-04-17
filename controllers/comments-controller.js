const {
  fetchCommentsByArticleId,
  addNewComment,
} = require("../models/comments-models");
const { checkIfArticleExists } = require("../models/articles-models");
const { checkIfUserExists } = require("../models/users-models");

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;

  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkIfArticleExists(article_id),
  ])
    .then(([comments]) => {
      response.status(200).send({ comments });
    })
    .catch((error) => next(error));
}

function postNewComment(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;

  checkIfArticleExists(article_id)
    .then(() => {
      return checkIfUserExists(username);
    })

    .then(() => {
      return addNewComment(article_id, username, body);
    })
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => next(error));
}

module.exports = { getCommentsByArticleId, postNewComment };
