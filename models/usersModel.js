const mongoose = require("mongoose");

// create schema for user
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { active: true }
);

// create model from the schema
const users = mongoose.model("users", userSchema);

module.exports = users;
