const express = require("express");
const users = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const secretKey = "your_jwt_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // Mock user verification (replace with actual database logic)
  const user = { id: "_id", email: email }; // Example user

  // Generate a JWT token

  res.json({ token }); // Send token to frontend

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });
    if (user) {
      if (password === user.password) {
        // Generate the token including the user's ID and other necessary info
        const token = jwt.sign(
          { _id: user._id, name: user.firstName }, // User payload
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token expiration time
        );
        res.status(200).json({ token }); // Return the token to the frontend
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST route to register a new user
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let userExists = await users.findOne({ email: email }).exec();
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = new users({
    firstName,
    lastName,
    email,
    password,
  });

  // Save the user to the database
  const savedUser = await newUser.save();
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
    },
  });
});

module.exports = router;

//GET The Data
router.get("/signdata", async (req, res) => {
  try {
    const showAll = await users.find();
    res.status(201).json(showAll);
  } catch (error) {
    console.error("Error during get collection", error);
    res.status(500).json({ error: "could not show" });
  }
});

//get single user
router.get("/signdata/:id", async (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;
  try {
    const singleuser = await users.findById({ _id: id });
    res.status(200).json(singleuser);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
  }
});

//delete operation
router.delete("/signdelete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleuser = await users.findByIdAndDelete({ _id: id });
    res.status(200).json(singleuser);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
  }
});

//put/patch operation
router.patch("/signupdate/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;
  try {
    const updateUser = await users.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.send(500).json({ error: error.message });
  }
});
