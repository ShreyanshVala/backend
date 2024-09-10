const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/userModel");

const router = express.Router();

//create
router.post("/post", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const userAdded = await User.create({
      name: name,
      email: email,
      age: age,
    });
    res.status(201).json(userAdded);
  } catch (error) {
    console.log(error);
    res.send(400).json({ error: error.message });
  }
});

//get
router.get("/get", async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(200).json(showAll);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
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
  const { name, email, age } = req.body;
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
