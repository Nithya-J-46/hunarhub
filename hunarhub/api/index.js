const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("../server/routes/auth"));
app.use("/api/entrepreneurs", require("../server/routes/entrepreneurs"));
app.use("/api/products", require("../server/routes/products"));
app.use("/api/orders", require("../server/routes/orders"));
app.use("/api/admin", require("../server/routes/admin"));
app.use("/api/reviews", require("../server/routes/reviews"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HunarHub API Running ✅" });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Export for Vercel (VERY IMPORTANT)
module.exports = serverless(app);