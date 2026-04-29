const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: String,
    password: String,
    role: String,
    experience:Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);