const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        share: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
