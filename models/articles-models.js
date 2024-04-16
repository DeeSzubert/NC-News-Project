const db = require("../db/connection");

function fetchArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "id not found" });
      }
      return rows[0];
    });
}

function fetchAllArticles() {
  const comment_count = 0;
  return db
    .query(
      "SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { fetchArticleById, fetchAllArticles };
