const UserModel = require("../models/usersModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { STATUSCODES, MESSAGES } = require("../utils/constants");

// Helper function to extract error message
const getErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Add a new user
const addUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    // Hash the password (uncomment if you want to use hashing)
    // const hashedPassword = await bcrypt.hash(password, 10);

    const userAdded = await UserModel.create({
      firstName,
      lastName,
      email,
      password, // use hashedPassword if hashing
    });

    res
      .status(STATUSCODES.CREATED)
      .json({ message: MESSAGES.USER_ADDED_SUCCESS, user: userAdded });
    console.log(MESSAGES.USER_ADDED_SUCCESS, userAdded);
  } catch (error) {
    console.error(error);
    res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: getErrorMessage(error),
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(STATUSCODES.OK).json(users);
  } catch (error) {
    console.error(error);
    res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: getErrorMessage(error),
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const user = await UserModel.findById(id);
      if (!user) {
        return res
          .status(STATUSCODES.NOT_FOUND)
          .json({ message: MESSAGES.USER_NOT_FOUND });
      }
      res.status(STATUSCODES.OK).json(user);
    } else {
      res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: MESSAGES.INVALID_USER_ID });
    }
  } catch (error) {
    console.error(error);
    res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: getErrorMessage(error),
    });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const userDeleted = await UserModel.findByIdAndDelete(id);
      if (userDeleted) {
        res
          .status(STATUSCODES.OK)
          .json({ message: MESSAGES.USER_DELETED_SUCCESS, data: userDeleted });
      } else {
        res
          .status(STATUSCODES.NOT_FOUND)
          .json({ message: MESSAGES.USER_NOT_FOUND });
      }
    } else {
      res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: MESSAGES.INVALID_USER_ID });
    }
  } catch (error) {
    console.error(error);
    res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: getErrorMessage(error),
    });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { firstName, lastName, email, password },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res
          .status(STATUSCODES.NOT_FOUND)
          .json({ error: MESSAGES.USER_NOT_FOUND });
      }

      res
        .status(STATUSCODES.OK)
        .json({ message: MESSAGES.USER_UPDATED_SUCCESS, data: updatedUser });
    } else {
      res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: MESSAGES.INVALID_USER_ID });
    }
  } catch (error) {
    console.error(error);
    res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: getErrorMessage(error),
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(STATUSCODES.UNAUTHORIZED)
        .json({ error: MESSAGES.INVALID_CREDENTIALS });
    }

    // Uncomment if you are hashing passwords
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(STATUSCODES.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
    // }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res
      .status(STATUSCODES.OK)
      .json({ message: MESSAGES.LOGIN_SUCCESS, user, accessToken });
  } catch (error) {
    console.error(error);
    res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error: getErrorMessage(error),
    });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  res.status(STATUSCODES.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });
};

// Exporting the functions
module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  loginUser,
  logoutUser,
};
