require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* ─────────────────────────────────────
   DB CONNECTION
───────────────────────────────────── */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  });
};

/* ─────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────── */
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.options("*", cors());
app.use(express.json());

// Connect to DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ─────────────────────────────────────
   ROUTES
───────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({ message: "FraudGuard API Working 🚀" });
});

app.use("/", authRoutes);
app.use("/", transactionRoutes);
app.use("/", adminRoutes);

module.exports = app;