const commentRouter = require("express").Router();
const {
  deleteCommentById,
  getPatchedCommentById,
} = require("../controllers/comments-controller");

commentRouter.delete("/:comment_id", deleteCommentById);
commentRouter.patch("/:comment_id", getPatchedCommentById);

module.exports = commentRouter;
