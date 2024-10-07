const Post = require("../models/postModel");
const User = require("../models/usersModel");
// Create a new post
// In your postController.js
const createPost = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id; // Extract user ID from the token
  console.log("User ID from token:", userId);

  try {
    const newPost = new Post({ title, description, createdBy: userId }); // Ensure createdBy is set to userId
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "firstName lastName"); // Populate user info if needed
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    // Check if the post exists and if the user is authorized to update it
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.createdBy.equals(userId)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    // Check if the post exists and if the user is authorized to delete it
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.createdBy.equals(userId)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
