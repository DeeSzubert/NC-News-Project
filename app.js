const express = require("express");
const app = express();
app.use(express.json());

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");
const {
  getCommentsByArticleId,
  postNewComment,
  deleteCommentById,
} = require("./controllers/comments-controller.js");
const { getAllUsers } = require("./controllers/users-controllers.js");
const { getAlltopics } = require("./controllers/topics-controllers.js");
const {
  getArticleById,
  getArticles,
  getPatchedArticle,
  getArticlesByTopic,
} = require("./controllers/articles-controllers.js");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getAlltopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);
// app.get("/api/articles?topic=cats", getArticlesByTopic);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", getPatchedArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (request, response) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
