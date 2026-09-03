const { Router } = require("express");
const postController = require("../controllers/blogPost");
const commentController = require("../controllers/comment");

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPost);
router.get("/:postId/comments", commentController.getPostComments);
router.put("/:postId/publish", postController.setPublishStatus);
router.delete("/:postId", postController.deletePost);
router.post("/", postController.createPost);
router.put("/:postId", postController.editPost);

module.exports = router;
