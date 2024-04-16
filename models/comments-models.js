const db = require("../db/connection");

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
}

module.exports = { fetchCommentsByArticleId };
