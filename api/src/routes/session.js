const { Router } = require("express");
const sessionController = require("../controllers/session");

const router = Router();

router.post("/login", sessionController.login);

module.exports = router;
