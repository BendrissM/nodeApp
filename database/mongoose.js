const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://benoxy:moncefbdofus98@ds251284.mlab.com:51284/nodeapp",
  {
    useNewUrlParser: true
  }
);
module.exports = { mongoose };
