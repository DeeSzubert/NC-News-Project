const express = require("express");
const app = express();
const apiRouter = require("express").Router();
const endpoints = require("../endpoints.json");
const userRouter = require("./users-router");
const commentRouter = require("./comments-router");
const topicRouter = require("./topics-router");
const articleRouter = require("./article-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);

apiRouter.get("/", (request, response, next) => {
  response.status(200).send({ endpoints });
});

module.exports = apiRouter;
