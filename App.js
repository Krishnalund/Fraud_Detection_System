require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();

/* ─────────────────────────────────────
   ENV CHECK (IMPORTANT)
───────────────────────────────────── */
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI missing");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing");
}

/* ─────────────────────────────────────
   DB CONNECTION (SAFE FOR VERCEL)
───────────────────────────────────── */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB error:", err.message);
  }
};

// connect once per cold start
connectDB();

/* ─────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────── */
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

/* ─────────────────────────────────────
   MODELS
───────────────────────────────────── */
const User = require("./models/User");
const Transaction = require("./models/Transaction");

/* ─────────────────────────────────────
   FRAUD LOGIC
───────────────────────────────────── */
function calculateRisk({ amount, device, location }) {
  let score = 0;
  let reasons = [];

  if (amount > 50000) {
    score += 50;
    reasons.push("High amount transfer");
  } else if (amount > 20000) {
    score += 20;
  }

  if (device === "Unknown") {
    score += 25;
    reasons.push("Unknown device");
  }

  if (location === "Foreign") {
    score += 25;
    reasons.push("Foreign location");
  }

  let riskLevel = "Low";
  let isFraud = false;

  if (score >= 70) {
    riskLevel = "High";
    isFraud = true;
  } else if (score >= 30) {
    riskLevel = "Medium";
  }

  return { score, reasons, isFraud, riskLevel };
}

/* ─────────────────────────────────────
   AUTH MIDDLEWARE
───────────────────────────────────── */
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

/* ─────────────────────────────────────
   ROUTES
───────────────────────────────────── */

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "FraudGuard API Working 🚀" });
});

/* ───────── REGISTER ───────── */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashed, role: "user" });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ───────── LOGIN ───────── */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ───────── ADD TRANSACTION ───────── */
app.post("/add-transaction", verifyToken, async (req, res) => {
  try {
    const { sender, receiver, amount, location, device } = req.body;

    const { score, reasons, isFraud, riskLevel } =
      calculateRisk({ amount, device, location });

    const tx = await Transaction.create({
      sender,
      receiver,
      amount,
      location,
      device,
      isFraud,
      riskLevel,
      riskScore: score,
      aiExplanation: reasons,
      userId: req.user.id,
    });

    res.json({ message: "Saved", tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ───────── GET TRANSACTIONS ───────── */
app.get("/transactions", verifyToken, async (req, res) => {
  const filter =
    req.user.role === "admin" ? {} : { userId: req.user.id };

  const data = await Transaction.find(filter);
  res.json(data);
});

/* ───────── ADMIN ROUTES ───────── */
app.get("/frauds", verifyToken, verifyAdmin, async (req, res) => {
  res.json(await Transaction.find({ isFraud: true }));
});

app.get("/total-transactions", verifyToken, verifyAdmin, async (req, res) => {
  res.json({ total: await Transaction.countDocuments() });
});

app.get("/total-frauds", verifyToken, verifyAdmin, async (req, res) => {
  res.json({ total: await Transaction.countDocuments({ isFraud: true }) });
});

/* ───────────────────────────────────── */
module.exports = app;