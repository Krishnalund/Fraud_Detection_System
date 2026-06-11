const Transaction = require("../models/Transaction");

exports.getFrauds = async (req, res) => {
  try {
    const frauds = await Transaction.find({ isFraud: true });
    res.json(frauds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalTransactions = async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalFrauds = async (req, res) => {
  try {
    const total = await Transaction.countDocuments({ isFraud: true });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getNodeStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $group: { _id: "$serverNode", count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};