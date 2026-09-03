const { Router } = require("express");
const commentController = require("../controllers/comment");

const router = Router();

router.get("/", commentController.getAllComments);
router.post("/", commentController.addComment);
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;
