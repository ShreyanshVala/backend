const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/userModel");

const router = express.Router();

//create
router.post("/add", async (req, res) => {
  console.log(req.body);
  const { name, email, mobile } = req.body;
  if (!name || !email || !mobile) {
    return res
      .status(400)
      .json({ error: "All fields (name, email, age) are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email address already in use" });
    }
    const userAdded = await User.create({ name, email, mobile });
    res.status(201).json(userAdded);
  } catch (error) {
    console.error("Error during user creation:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

//get
router.get("/get", async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(201).json(showAll);
  } catch (error) {
    console.error("Error during get collection", error);
    res.status(500).json({ error: "could not show" });
  }
});

//get single user
router.get("/get/:id", async (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;
  try {
    const singleuser = await User.findById({ _id: id });
    res.status(200).json(singleuser);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
  }
});

//delete opaeration
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleuser = await User.findByIdAndDelete({ _id: id });
    res.status(200).json(singleuser);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
  }
});

//put/patch operation
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
  }
});

module.exports = router;
