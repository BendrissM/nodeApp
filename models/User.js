let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let _ = require("lodash");

// User Schema
let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// template the user api
userSchema.methods.toJSON = function() {
  let user = this;
  let userObj = user.toObject();

  return _.pick(userObj, ["_id", "username", "email"]);
};

userSchema.methods.genAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => {
    return token;
  });
};

module.exports = mongoose.model("user", userSchema);
