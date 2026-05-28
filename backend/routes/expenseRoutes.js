const express = require("express");
const {
  createExpense,
  getExpenses,
  deleteExpense,
  getSettlements,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getExpenses).post(protect, createExpense);
router.route("/:id").delete(protect, deleteExpense);
router.get("/settlements", protect, getSettlements);

module.exports = router;
