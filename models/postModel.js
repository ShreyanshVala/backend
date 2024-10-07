const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // User who created the post is required
    },
    title: {
      type: String,
      required: true, // Post title is required
    },
    description: {
      type: String,
      required: true, // Post description is required
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
