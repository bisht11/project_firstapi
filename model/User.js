const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001, //default basic value
    },
    Editor: Number, // not available by default
    Admin: Number, // not available by default
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

// model - create and export
module.exports = mongoose.model("User", userSchema);
