const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT2 || 7002;
const MONGOURL = process.env.MONGO_URL2;

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
  contact: String,
  email: String,
  location: String,
  contact_person: String,
});

const UserModel = mongoose.model("client", userSchema);

const user2Schema = new mongoose.Schema({
  productID: String,
  product: String,
  category: String,
});

const ProductModel = mongoose.model("Product", user2Schema);

const transSchema = new mongoose.Schema({
  clientID: String,
  productID: String,
  client: String,
  product: String,
  startDate: String,
  days: Number,
  expiry: String,
  status: Number,
});

const transModel = mongoose.model("Transaction", transSchema);

app.post("/", async (req, res) => {
  try {
    const newCustomer = await UserModel.create(req.body);

    res.json(newCustomer);
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.post("/product", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);

    res.json(newProduct);
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.post("/trans", async (req, res) => {
  try {
    const newTrans = await transModel.create(req.body);

    res.json(newTrans);
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.get("/trans", async (req, res) => {
  const userData = await transModel.find();

  res.json(userData);
});

app.get("/", async (req, res) => {
  const userData = await UserModel.find();

  res.json(userData);
});

app.get("/product", async (req, res) => {
  const userData = await ProductModel.find();

  res.json(userData);
});

app.get("/product/:product", async (req, res) => {
  try {
    const user = await ProductModel.findOne({ product: req.params.product }); // Find user by username
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send the user data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/client", async (req, res) => {
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

app.get("/client/:client", async (req, res) => {
  try {
    const user = await transModel.findOne({ client: req.params.client }); // Find user by username
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send the user data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/newSupport/:client", async (req, res) => {
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

app.get("/clientID/:clientID", async (req, res) => {
  try {
    const user = await transModel.findOne({ clientID: req.params.clientID }); // Find user by clientID
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
    const user = await transModel.findOneAndUpdate(
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

app.put("/clientID/:clientID", async (req, res) => {
  try {
    const clientID = req.params.clientID;
    const updateData = req.body;

    // Find user by username and update with new data
    const user = await transModel.findOneAndUpdate(
      { clientID }, // Query: find by username
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

app.get("/clients/:id", async (req, res) => {
  const { id } = req.params;
  const client = await UserModel.findOne({ clientID: id });

  if (client) {
    res.status(200).json({ exists: true });
  } else {
    res.status(404).json({ exists: false });
  }
});
