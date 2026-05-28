const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/User");
const { calculateSettlements } = require("../utils/settlement");

const createExpense = async (req, res, next) => {
  try {
    const { amount, description, participants, category } = req.body;

    if (amount == null || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: "Participants are required" });
    }

    const invalidParticipant = participants.some(
      (participant) =>
        !participant ||
        !participant.user ||
        !mongoose.Types.ObjectId.isValid(participant.user) ||
        typeof participant.share !== "number" ||
        participant.share < 0
    );

    if (invalidParticipant) {
      return res.status(400).json({ message: "Each participant must include a valid user ID and a non-negative share" });
    }

    const totalShare = participants.reduce((sum, participant) => sum + participant.share, 0);
    if (totalShare !== amount) {
      return res.status(400).json({ message: "Participant shares must total the expense amount" });
    }

    const expense = await Expense.create({
      paidBy: req.user._id,
      amount,
      description,
      participants,
      category,
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({})
      .populate("paidBy", "name email")
      .populate("participants.user", "name email");

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.remove();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    next(error);
  }
};

const getSettlements = async (req, res, next) => {
  try {
    const expenses = await Expense.find({})
      .populate("paidBy", "name")
      .populate("participants.user", "name");

    const users = {};

    expenses.forEach((expense) => {
      const paidBy = expense.paidBy.name;

      if (!users[paidBy]) {
        users[paidBy] = { name: paidBy, balance: 0 };
      }

      users[paidBy].balance += expense.amount;

      expense.participants.forEach((participant) => {
        const participantName = participant.user.name;
        if (!users[participantName]) {
          users[participantName] = { name: participantName, balance: 0 };
        }
        users[participantName].balance -= participant.share;
      });
    });

    const settlements = calculateSettlements(Object.values(users));
    res.json(settlements);
  } catch (error) {
    next(error);
  }
};

module.exports = { createExpense, getExpenses, deleteExpense, getSettlements };
