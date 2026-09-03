const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userDB = require("../models/user");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await userDB.getFullUserByUsername(username);
    if (!foundUser) {
      return res.status(401).json({
        message: "Auth Failed",
        errors: {
          username: "User not found.",
        },
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      return res.status(401).json({
        message: "Auth Failed",
        errors: {
          password: "Incorrect password.",
        },
      });
    }

    const secret = process.env.SECRET_KEY;
    const token = jwt.sign({ username }, secret, {
      expiresIn: Number(process.env.JWT_EXPIRE),
    });
    return res.status(200).json({
      message: "Auth Passed",
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        is_blog_author: foundUser.is_blog_author,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  login,
};
