const { Router } = require("express");
const userController = require("../controllers/user");

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/me", userController.getMe);
router.get("/:userId", userController.getUser);
router.post("/", userController.postSignup);

module.exports = router;
