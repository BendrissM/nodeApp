const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = passport => {
  // Local Strategy
  passport.use(
    new localStrategy((username, password, done) => {
      // match username
      let query = { username: username };
      User.findOne(query, (err, user) => {
        if (err) {
          throw err;
        }
        if (!user) {
          return done(null, false, { message: "no user found" });
        }
        //Match the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "wrong password" });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
