const Transaction = require("../models/Transaction");

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

exports.addTransaction = async (req, res) => {
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
};

exports.getTransactions = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { userId: req.user.id };

    const data = await Transaction.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};