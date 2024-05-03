const db = require("../db/connection");

function fetchArticleById(article_id) {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id  WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "id not found" });
      }
      return rows[0];
    });
}

function fetchAllArticles(sort_by, order) {
  const validSortBys = ["created_at", "author", "topic"];
  const validOrder = ["asc", "desc"];
  const queryValue = [];

  if (!validSortBys.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "invalid query value" });
  }
  let sqlQueryString = `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  sqlQueryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} `;

  return db.query(sqlQueryString, queryValue).then(({ rows }) => {
    return rows;
  });
}

function checkIfArticleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, message: "id not found" });
      }
      return comments;
    });
}

function patchArticle(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "id not found",
        });
      }
      return rows[0];
    });
}

function fetchArticleByTopic(query, queryValue) {
  return db
    .query(`SELECT * FROM articles WHERE ${query} = $1`, [queryValue])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "topic not found" });
      }
      return rows;
    });
}

function addNewArticle(title, topic, author, body) {
  return db
    .query(
      `INSERT INTO articles
          (title, topic, author, body)
          VALUES
          ($1,$2,$3,$4)
                 RETURNING *;`,
      [title, topic, author, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "topic not found" });
      }
      return rows[0];
    });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  checkIfArticleExists,
  patchArticle,
  fetchArticleByTopic,
  addNewArticle,
};
