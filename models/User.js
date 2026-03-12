const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userid: String,
  password: String
});

module.exports = mongoose.model("User", UserSchema);
