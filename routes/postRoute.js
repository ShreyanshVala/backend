const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/postModel");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// adding posts:
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const createdBy = req.user._id; // Extract user ID from the decoded token

    const newPost = new Post({
      title,
      description,
      createdBy, // Save the user ID who created the post
    });

    await newPost.save();
    res.status(200).json({ data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating post" });
  }
});

// Route to get posts created by the logged-in user
router.get("/get", authMiddleware, async (req, res) => {
  try {
    // Fetch posts where 'createdBy' matches the logged-in user's ID
    const posts = await Post.find({ createdBy: req.user._id });
    if (!posts) {
      return res.status(404).json({ error: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific post by post ID
router.get("/get/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Find post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a post by post ID
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the post by ID
    const deletedPost = await Post.findOneAndDelete({
      _id: id,
      createdBy: req.user._id, // Ensure only the post owner can delete the post
    });
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Route to update a post by post ID
router.patch("/update/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Find the post by ID and update it if it belongs to the logged-in user
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, createdBy: req.user._id }, // Ensure only the owner can update
      { title, description },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
