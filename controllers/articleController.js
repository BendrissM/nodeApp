let Article = require("../models/article");
let User = require("../models/User");
const { body, validationResult } = require("express-validator/check");

// Display List of articles
exports.article_list = (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("articles/index", {
        title: "Articles",
        articles: articles
      });
    }
  });
};

// Display detail page for an article
exports.article_detail = (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      User.findById(article.author, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          res.render("articles/show_article", {
            author: user.username,
            article: article
          });
        }
      });
    }
  });
};

// Display article create form on GET request
exports.article_create_get = (req, res) => {
  res.render("articles/add_article", {
    title: "add article"
  });
};

// article create Validation
exports.article_create_validation = [
  body("title", "title is required")
    .not()
    .isEmpty(),
  body("body")
    .not()
    .isEmpty()
    .withMessage("the body is required")
    .isLength({ min: 5 })
    .withMessage("body must be at least 5 chars long")
];

// Handel article create on POST
exports.article_create_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    /* res.render("articles/add_article", {
      errors: errors.array()
    }); */
    res.status(400).send();
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article
      .save()
      .then(doc => {
        /* req.flash("success", "Article Created");
      res.redirect("/articles/" + article.id); */
        res.status(200).send(doc);
      })
      .catch(e => {
        res.status(400).send("unable to create : " + e);
      });
  }
};

// Display article edit form on GET request
exports.article_edit_get = (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      if (article.author !== req.user.id) {
        req.flash("danger", "unauthorized");
        res.redirect("/");
      } else {
        res.render("articles/edit_article", {
          title: "Edit Article",
          article: article
        });
      }
    }
  });
};

// Handel article edit PUT request
exports.article_edit_put = (req, res) => {
  let query = { _id: req.params.id };
  let article = {};
  article.title = req.body.title;
  article.body = req.body.body;
  Article.findOneAndUpdate(query, article, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "article Updated");
      res.redirect("/");
    }
  });
};

// Handel article delete DELETE request
exports.article_delete = (req, res) => {
  if (!req.user) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };
  Article.findById(req.params.id, (err, article) => {
    if (req.user.id !== article.author) {
      res.status(500).send();
    } else {
      Article.findOneAndRemove(query, (err, article) => {
        if (err) {
          console.log(err);
          return;
        } else {
          res.send(article);
        }
      });
    }
  });
};

// access control
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
};
