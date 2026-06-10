const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  amount: Number,
  location: String,
  device: String,
  ipAddress: String,
  transactionTime: String,
  isFraud: Boolean,
  riskLevel: String,
  riskScore: Number,
  aiExplanation: [String],
  serverNode: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Transaction", transactionSchema);