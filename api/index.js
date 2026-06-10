const connectDB = require("../lib/db");

module.exports = async (req, res) => {
  await connectDB();

  res.status(200).json({
    message: "FraudGuard API Working 🚀",
  });
};