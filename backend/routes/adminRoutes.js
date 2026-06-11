const express = require("express");
const router = express.Router();
const { getFrauds, getTotalTransactions, getTotalFrauds } = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/frauds", verifyToken, verifyAdmin, getFrauds);
router.get("/total-transactions", verifyToken, verifyAdmin, getTotalTransactions);
router.get("/total-frauds", verifyToken, verifyAdmin, getTotalFrauds);

module.exports = router;