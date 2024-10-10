const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 7002;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const userSchema = new mongoose.Schema({
  clientID: String,
  client: String,
  startDate: String,
  days: Number,
  expiry: String,
  status: String,
  product: String,
});

const UserModel = mongoose.model("expiry", userSchema);

app.post("/", async (req, res) => {
  try {
    const newExpiry = await UserModel.create(req.body);

    res.json(newExpiry);
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.get("/", async (req, res) => {
  const userData = await UserModel.find();

  res.json(userData);
});

app.get("/client/:client", async (req, res) => {
  try {
    const user = await UserModel.findOne({ client: req.params.client }); // Find user by username
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send the user data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/client/:clientID", async (req, res) => {
  try {
    const user = await UserModel.findOne({ client: req.params.clientID }); // Find user by clientID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send the user data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/client/:client", async (req, res) => {
  try {
    const client = req.params.client;
    const updateData = req.body;

    // Find user by username and update with new data
    const user = await UserModel.findOneAndUpdate(
      { client }, // Query: find by username
      { $set: updateData }, // Data to update
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send the updated user data as response
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
