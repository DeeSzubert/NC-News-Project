const db = require("../db/connection");

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
}

function addNewComment(article_id, username, body) {
  return db
    .query(
      `INSERT INTO comments
          (article_id, author, body )
          VALUES
          ($1,$2,$3)
                 RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { fetchCommentsByArticleId, addNewComment };
