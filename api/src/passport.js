const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userDB = require("./models/user");
const passport = require("passport");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const foundUser = await userDB.getUserByUsername(jwt_payload.username);
    if (foundUser) {
      return done(null, foundUser);
    }
    return done(null, false);
  }),
);

module.exports = passport;
