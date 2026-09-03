const userDB = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("../passport");

const validateSignup = [
  body("name")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Name must be between 5 and 100 characters."),
  body("username")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Username must be between 1 and 30 characters.")
    .custom((value) => !/\s/.test(value))
    .withMessage("Username must not contain spaces.")
    .custom(async (value) => {
      const user = await userDB.getUserByUsername(value);
      if (user) {
        throw new Error("Username is already in use, choose another!");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Password must be between 1 and 30 characters."),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),
];

const getAllUsers = async (req, res) => {
  try {
    const users = await userDB.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "User id must be a number.",
        userId: req.params.userId,
      });
    }
    const user = await userDB.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
  return res.status(500).json({ error: "Internal server error" });
};

const postSignup = [
  validateSignup,
  async (req, res) => {
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
      const name = req.body.name;
      const username = req.body.username;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await userDB.createUser(name, username, hashedPassword);
      return res.status(201).json({
        id: user.id,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
      });
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

const getMe = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await userDB.getUserById(req.user.id);
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
    }
    return res.status(500).json({ error: "Internal server error" });
  },
];

module.exports = {
  getAllUsers,
  getUser,
  postSignup,
  getMe,
};
