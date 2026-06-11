require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* ─────────────────────────────────────
   ENV CHECK
───────────────────────────────────── */
if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

/* ─────────────────────────────────────
   DB CONNECTION
───────────────────────────────────── */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB error:", err.message);
  }
};

connectDB();

/* ─────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────── */
app.use(cors({
  
  origin: ['https://transact-guard-frontend.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

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