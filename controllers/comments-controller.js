const {
  fetchCommentsByArticleId,
  addNewComment,
  removeCommentById,
  checkIfCommentExists,
} = require("../models/comments-models");
const { checkIfArticleExists } = require("../models/articles-models");
const { checkIfUserExists } = require("../models/users-models");
const { patchedCommentById } = require("../models/comments-models");

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

function deleteCommentById(request, response, next) {
  const { comment_id } = request.params;
  checkIfCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => next(error));
}

function getPatchedCommentById(request, response, next) {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  checkIfCommentExists(comment_id)
    .then(() => {
      return patchedCommentById(comment_id, inc_votes);
    })
    .then((patchedComment) => {
      response.status(200).send({ patchedComment });
    })
    .catch((error) => next(error));
}

module.exports = {
  getCommentsByArticleId,
  postNewComment,
  deleteCommentById,
  getPatchedCommentById,
};
