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
      return rows[0];
    });
}

function checkIfCommentExists(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
      return rows;
    });
}

function removeCommentById(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      return rows;
    });
}

function patchedCommentById(comment_id, inc_votes) {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  checkIfCommentExists,
  fetchCommentsByArticleId,
  addNewComment,
  removeCommentById,
  patchedCommentById,
};
