const express = require("express");
const router = express.Router();
const { addTransaction, getTransactions } = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/auth");

router.post("/add-transaction", verifyToken, addTransaction);
router.get("/transactions", verifyToken, getTransactions);

module.exports = router;