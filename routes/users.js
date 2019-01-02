const express = require("express");
const router = express.Router();

let userController = require("../controllers/userController");

// User Routes //

// GET request for creating an article
router.get("/register", userController.user_register_get);

// POST request for creating an article
router.post(
  "/register",
  userController.user_register_validation,
  userController.user_register_post
);

router.get("/login", userController.user_login_get);

router.post(
  "/login",
  userController.user_login_validation,
  userController.user_login_post
);

router.get("/logout", userController.user_logout);

module.exports = router;
