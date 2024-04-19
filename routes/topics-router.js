const topicRouter = require("express").Router();
const { getAlltopics } = require("../controllers/topics-controllers");

topicRouter.get("/", getAlltopics);

module.exports = topicRouter;
