const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { mongoose } = require("./database/mongoose");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 3000;

// init Routes
let indexRouter = require("./routes/index");
let articlesRouter = require("./routes/articles");
let usersRouter = require("./routes/users");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Express messages Middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// passport config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// set public folder
app.use(express.static(path.join(__dirname, "Public")));

// set View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set Routes
app.use("/", indexRouter);
app.use("/articles", articlesRouter);
app.use("/users", usersRouter);

// connect to databse
let db = mongoose.connection;

// check connection
db.once("open", () => {
  /* console.log("connected to mongodb"); */
});

// check for db errors
db.on("error", err => {
  console.log(err);
});

// start server
app.listen(port, () => {
  console.log("server satrted on port" + port);
});

exports.app = app;
