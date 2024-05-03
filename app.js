const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const cors = require("cors");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

const apiRouter = require("./routes/api-router.js");

const commentRouter = require("./routes/comments-router.js");
const topicRouter = require("./routes/topics-router.js");
const articleRouter = require("./routes/article-router.js");
const userRouter = require("./routes/users-router.js");

app.use("/api", apiRouter);
app.use("/users", userRouter);
app.use("/comments", commentRouter);
app.use("/topics", topicRouter);
app.use("/articles", articleRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (request, response) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
