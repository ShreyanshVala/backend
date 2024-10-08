const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

// app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

const postRoute = require("./routes/postRoute");
const usersRoute = require("./routes/usersRoute");

app.use(express.json());
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Connected Successfully");
    app.listen(process.env.PORT || 8000, (err) => {
      if (err) console.log(err);
      console.log("running successfuly at", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("error", error);
  });

app.use("/api", usersRoute);
app.use("/post", postRoute);

// Simple message endpoint
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my simple Node.js app!");
});
