const articleRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  getPatchedArticle,
  getNewArticle,
} = require("../controllers/articles-controllers.js");

const {
  getCommentsByArticleId,
  postNewComment,
} = require("../controllers/comments-controller.js");

articleRouter.get("/:article_id/comments", getCommentsByArticleId);
articleRouter.post("/:article_id/comments", postNewComment);
articleRouter.patch("/:article_id", getPatchedArticle);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/", getArticles);

articleRouter.post("/", getNewArticle);

module.exports = articleRouter;
