const blogPostDB = require("../models/blogPost");
const passport = require("../passport");
const optionalJwt = require("../middlewares/optionalJwt");

const getAllPosts = [
  optionalJwt,
  async (req, res) => {
    try {
      if (req.user?.is_blog_author) {
        const status = req.query.status;

        if (status === "published") {
          const posts = await blogPostDB.getAllPublishedPosts();
          return res.json(posts);
        }

        if (status === "unpublished") {
          const posts = await blogPostDB.getAllUnpublishedPosts();
          return res.json(posts);
        }
        const posts = await blogPostDB.getAllPosts();
        return res.json(posts);
      }

      const posts = await blogPostDB.getAllPublishedPosts();
      return res.json(posts);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const getPost = [
  optionalJwt,
  async (req, res) => {
    const postId = Number(req.params.postId);
    try {
      if (Number.isNaN(postId)) {
        return res.status(400).json({ message: "Post id must be a number." });
      }

      const post = await blogPostDB.getPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
      if (post.is_published === false && req.user?.is_blog_author === false) {
        return res.status(403).json({ message: "No permission." });
      }

      return res.status(200).json(post);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const setPublishStatus = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postId = Number(req.params.postId);
    const isPublished = JSON.parse(req.body.isPublished);
    try {
      if (!req.user.is_blog_author) {
        res.status(403).json({ message: "No permission." });
      }
      if (Number.isNaN(postId)) {
        return res.status(400).json({
          message: "Post id must be a number.",
          postId: req.params.postId,
        });
      }

      const post = await blogPostDB.setPublishStatus(postId, isPublished);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const deletePost = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postId = Number(req.params.postId);
    try {
      if (!req.user.is_blog_author) {
        res.status(403).json({ message: "No permission." });
      }
      if (Number.isNaN(postId)) {
        return res.status(400).json({
          message: "Post id must be a number.",
          postId: req.params.postId,
        });
      }

      const post = await blogPostDB.deletePost(postId);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const createPost = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { title, intro, isPublished, content } = req.body;
    const user = req.user;
    try {
      if (!req.user.is_blog_author) {
        res.status(403).json({ message: "No permission." });
      }
      if (!title || !intro || isPublished === undefined || !content) {
        return res.status(400).json({
          message:
            "The fields are required: title, intro, isPublished, content.",
        });
      }

      const post = await blogPostDB.createPost(
        user.id,
        title,
        intro,
        content,
        isPublished,
      );
      return res.status(201).json(post);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const editPost = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { title, intro, isPublished, content } = req.body;
    const postId = Number(req.params.postId);

    try {
      if (!req.user.is_blog_author) {
        return res.status(403).json({ message: "No permission." });
      }

      if (Number.isNaN(postId)) {
        return res.status(400).json({ message: "Post id must be a number." });
      }
      if (!title || !intro || isPublished === undefined || !content) {
        return res.status(400).json({
          message:
            "The fields are required: title, intro, isPublished, content.",
        });
      }

      const post = await blogPostDB.editPost(
        postId,
        title,
        intro,
        content,
        isPublished,
      );

      return res.status(201).json(post);
    } catch (err) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Post not found." });
      }
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

module.exports = {
  getAllPosts,
  getPost,
  setPublishStatus,
  deletePost,
  createPost,
  editPost,
};
