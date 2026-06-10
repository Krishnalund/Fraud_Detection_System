const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

module.exports = connectDB;