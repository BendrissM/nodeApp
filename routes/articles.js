const express = require("express");
const router = express.Router();

let articleController = require("../controllers/articleController");

// Article Routes //

// GET articles
router.get("/", articleController.article_list);

// GET request for creating an article
router.get(
  "/create",
  articleController.ensureAuthenticated,
  articleController.article_create_get
);

// POST request for creating an article
router.post(
  "/create",
  articleController.article_create_validation,
  articleController.article_create_post
);

// GET request for showing an articles
router.get("/:id", articleController.article_detail);

// GET request for edit an article
router.get(
  "/edit/:id",
  articleController.ensureAuthenticated,
  articleController.article_edit_get
);

// put request for edit an article
router.post("/edit/:id", articleController.article_edit_put);

// delete request for delete an article
router.delete("/delete/:id", articleController.article_delete);

module.exports = router;
