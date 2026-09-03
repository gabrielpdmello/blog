const express = require("express");
const routes = require("./routes");
const passport = require("./passport");
const cors = require("cors");

// express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
if (process.env.ENV === "prod") {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      // allows requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors()); // enable all CORS requests
}

// routes
app.use("/users", routes.user);
app.use("/posts", routes.blogPost);
app.use("/comments", routes.comment);
app.use("/session", routes.session);

// protected route example
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).json({ message: "YAY! this is a protected Route" });
  },
);

module.exports = app;
