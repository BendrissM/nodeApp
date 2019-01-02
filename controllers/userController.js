let User = require("../models/User");
const { body, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Display user register form on GET request
exports.user_register_get = (req, res) => {
  res.render("auth/register", {
    title: "User Registration"
  });
};

// user register Validation
exports.user_register_validation = [
  body("username", "username field is required")
    .not()
    .isEmpty(),
  body("email")
    .not()
    .isEmpty()
    .withMessage("email field is required")
    .isEmail()
    .withMessage("email field must be an email")
    .custom(value => {
      return User.find({ email: value }).then(user => {
        if (user.length > 0) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("the password is required")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 chars long"),
  body("password2")
    .not()
    .isEmpty()
    .withMessage("the confirmation password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      } else {
        return true;
      }
    })
];

// Handel user register on POST
exports.user_register_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("auth/register", {
      errors: errors.array()
    });
  } else {
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return;
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return;
        }
        user.password = hash;
        user.save(err => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "You have been registred now you can login !");
            res.redirect("/users/login");
          }
        });
      });
    });
  }
};

// Display user login form on GET request
exports.user_login_get = (req, res) => {
  res.render("auth/login", {
    title: "User Login"
  });
};

exports.user_login_validation = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("username field is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("the password is required")
];

// Handle user login on POST request
exports.user_login_post = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("auth/login", {
      errors: errors.array()
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  }
};

exports.user_logout = (req, res) => {
  req.logout();
  req.flash("success", "you are logged out");
  res.redirect("/users/login");
};
