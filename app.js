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
} = require("./controllers/comments-controller.js");
const { getAlltopics } = require("./controllers/topics-controllers.js");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles-controllers.js");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getAlltopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postNewComment);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (request, response) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
