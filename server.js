require("dotenv").config(); // load .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");       // for hashing passwords
const jwt = require("jsonwebtoken");      // for creating tokens

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✓"))
  .catch((err) => console.log(err));

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
}));

app.use(express.json());

// ─── User Schema ──────────────────────────────────────────
// This stores each registered user in the database
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },  // no duplicate emails
  password:  { type: String, required: true },                // hashed, never plain text
  role:      { type: String, default: "user" },               // "user" or "admin"
});

const User = mongoose.model("User", userSchema);

// ─── Transaction Schema ───────────────────────────────────
const transactionSchema = new mongoose.Schema({
  sender:          String,
  receiver:        String,
  amount:          Number,
  location:        String,
  device:          String,
  ipAddress:       String,
  transactionTime: String,
  isFraud:         Boolean,
  riskLevel:       String,
  riskScore:       Number,
  aiExplanation:   [String],
  serverNode:      String,
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who submitted this
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// ─── Fraud Logic ──────────────────────────────────────────
function calculateRisk({ amount, device, location }) {
  let score   = 0;
  let reasons = [];

  if (amount > 50000) {
    score += 50;
    reasons.push("Amount exceeds 50,000 — high-value transfer");
  } else if (amount > 20000) {
    score += 20;
    reasons.push("Amount exceeds 20,000 — medium-value transfer");
  }

  if (device === "Unknown") {
    score += 25;
    reasons.push("Unknown device used — unrecognized access point");
  }

  if (location === "Foreign") {
    score += 25;
    reasons.push("Foreign location detected — transaction origin outside Pakistan");
  }

  let riskLevel;
  let isFraud;

  if (score >= 70) {
    isFraud   = true;
    riskLevel = "High";
  } else if (score >= 30) {
    isFraud   = false;
    riskLevel = "Medium";
  } else {
    isFraud   = false;
    riskLevel = "Low";
  }

  return { score, reasons, isFraud, riskLevel };
}

const NODES = ["Karachi-Node", "Lahore-Node", "Islamabad-Node"];
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Auth Middleware ──────────────────────────────────────
// This function runs BEFORE protected routes
// It checks if the request has a valid token
function verifyToken(req, res, next) {
  // Token comes in the request header like: Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // extract the token part

  if (!token) {
    return res.status(401).json({ message: "Access denied. Please login first." });
  }

  try {
    // jwt.verify checks if token is valid and not expired
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to the request
    next();             // move to the actual route
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token. Please login again." });
  }
}

// Admin-only middleware — runs after verifyToken
function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}

// ─── Auth Routes ──────────────────────────────────────────

// REGISTER — anyone can create an account
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    // Hash the password before saving (10 = how strong the hash is)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // everyone starts as a regular user
    }).save();

    res.json({ message: "Account created successfully! Please login." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
});

// LOGIN — check email + password, return token
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Create a token — contains user id, name, role
    // expires in 7 days — user stays logged in for 7 days
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

// ─── Protected Transaction Routes ─────────────────────────
app.get("/", (req, res) => res.send("Fraud Detection Server Running"));

// Add transaction — any logged in user can submit
app.post("/add-transaction", verifyToken, async (req, res) => {
  try {
    const { sender, receiver, amount, location, device, ipAddress, transactionTime } = req.body;
    const { score, reasons, isFraud, riskLevel } = calculateRisk({ amount, device, location });

    const tx = await new Transaction({
      sender, receiver, amount, location, device, ipAddress, transactionTime,
      serverNode: pick(NODES),
      isFraud, riskLevel, riskScore: score, aiExplanation: reasons,
      userId: req.user.id, // save who submitted this transaction
    }).save();

    res.json({ message: "Transaction Saved", fraudDetected: isFraud, riskLevel, riskScore: score, reasons });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Simulate — any logged in user
app.post("/simulate-transaction", verifyToken, async (req, res) => {
  try {
    const { sender, receiver, amount } = req.body;

    const device   = pick(["Mobile", "Desktop", "Unknown"]);
    const location = pick(["Local", "Foreign"]);
    const ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const transactionTime = new Date().toISOString();
    const serverNode = pick(NODES);

    const { score, reasons, isFraud, riskLevel } = calculateRisk({ amount, device, location });

    await new Transaction({
      sender, receiver, amount, location, device, ipAddress, transactionTime,
      serverNode, isFraud, riskLevel, riskScore: score, aiExplanation: reasons,
      userId: req.user.id,
    }).save();

    res.json({
      message: "Simulation complete",
      transaction: {
        sender, receiver, amount, location, device, serverNode,
        isFraud, riskLevel, riskScore: score, aiExplanation: reasons,
      },
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// USER: see only their own transactions
app.get("/transactions", verifyToken, async (req, res) => {
  try {
    // admin sees all, user sees only their own
    const filter = req.user.role === "admin" ? {} : { userId: req.user.id };
    res.json(await Transaction.find(filter));
  } catch (e) { res.status(500).send(e); }
});

// ADMIN ONLY routes — dashboard stats
app.get("/frauds",                verifyToken, verifyAdmin, async (req, res) => { try { res.json(await Transaction.find({ isFraud: true })); } catch (e) { res.status(500).send(e); } });
app.get("/safe-transactions",     verifyToken, verifyAdmin, async (req, res) => { try { res.json(await Transaction.find({ isFraud: false })); } catch (e) { res.status(500).send(e); } });
app.get("/high-risk-transactions",verifyToken, verifyAdmin, async (req, res) => { try { res.json(await Transaction.find({ riskLevel: "High" })); } catch (e) { res.status(500).send(e); } });
app.get("/alerts",                verifyToken, verifyAdmin, async (req, res) => { try { res.json(await Transaction.find({ isFraud: true })); } catch (e) { res.status(500).send(e); } });

app.get("/total-transactions", verifyToken, verifyAdmin, async (req, res) => {
  try { res.json({ totalTransactions: await Transaction.countDocuments() }); } catch (e) { res.status(500).send(e); }
});

app.get("/total-frauds", verifyToken, verifyAdmin, async (req, res) => {
  try { res.json({ totalFrauds: await Transaction.countDocuments({ isFraud: true }) }); } catch (e) { res.status(500).send(e); }
});

app.get("/node-stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const stats = await Transaction.aggregate([{ $group: { _id: "$serverNode", count: { $sum: 1 } } }]);
    res.json(stats);
  } catch (e) { res.status(500).send(e); }
});

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));