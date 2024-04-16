const { fetchCommentsByArticleId } = require("../models/comments-models");
const { checkIfArticleExists } = require("../models/articles-models");

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

module.exports = { getCommentsByArticleId };
