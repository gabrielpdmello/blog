const optionalJwt = require("../middlewares/optionalJwt");
const commentDB = require("../models/comment");
const blogPostDB = require("../models/blogPost");
const passport = require("../passport");
const { body, validationResult } = require("express-validator");

const validateComment = [
  body("comment")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment cannot be empty.")
    .isLength({ max: 500 })
    .withMessage("Comment cannot have more than 500 characters."),
];

const getAllComments = [
  optionalJwt,
  async (req, res) => {
    try {
      if (req.user?.is_blog_author) {
        const status = req.query.status;

        if (status === "published") {
          const comments = await commentDB.getAllCommentsPublished();
          return res.status(200).json(comments);
        }

        const comments = await commentDB.getAllComments();
        return res.status(200).json(comments);
      }
      const comments = await commentDB.getAllCommentsPublished();
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const getPostComments = [
  optionalJwt,
  async (req, res) => {
    const postId = Number(req.params.postId);
    try {
      if (Number.isNaN(postId)) {
        return res.status(400).json({
          message: "Post id must be a number.",
          postId: req.params.postId,
        });
      }

      const post = await blogPostDB.getPostById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      if (post.is_published === false && req.user?.is_blog_author === false) {
        return res.status(403).json({ message: "Post is not published." });
      }

      const comments = await commentDB.getCommentsByPostId(postId);
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const addComment = [
  passport.authenticate("jwt", { session: false }),
  validateComment,
  async (req, res) => {
    const postId = Number(req.body.postId);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsObj = errors.array().reduce((accumulator, error) => {
        accumulator[error.path] = error.msg;
        return accumulator;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorsObj,
      });
    }

    try {
      if (Number.isNaN(postId)) {
        return res.status(400).json({
          message: "Post id must be a number.",
          postId: req.params.postId,
        });
      }

      const comment = req.body.comment;
      const newComment = await commentDB.addComment(
        postId,
        req.user.id,
        comment,
      );
      res.status(201).json(newComment);
    } catch (err) {
      console.log(err);
    }
  },
];

const deleteComment = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const commentId = Number(req.params.commentId);

    try {
      if (Number.isNaN(commentId)) {
        return res.status(400).json({
          message: "Comment id must be a number.",
          commentId: req.params.commentId,
        });
      }

      const comment = await commentDB.getCommentById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      if (
        comment.user_id !== req.user.id &&
        req.user.is_blog_author === false
      ) {
        return res.status(403).json({ message: "Cannot delete comment." });
      }
      await commentDB.deleteComment(commentId);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

module.exports = {
  getAllComments,
  getPostComments,
  addComment,
  deleteComment,
};
