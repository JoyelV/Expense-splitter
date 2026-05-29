const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Expense = require("./models/Expense");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const usersToCreate = [
  { name: "Alice", email: "alice2@example.com", password: "Password123!" },
  { name: "Bob", email: "bob@example.com", password: "Password123!" },
  { name: "Charlie", email: "charlie@example.com", password: "Password123!" },
];

const expenses = [
  { payerEmail: "alice2@example.com", amount: 1200, description: "Hotel", category: "Accommodation" },
  { payerEmail: "bob@example.com", amount: 450, description: "Food", category: "Food" },
  { payerEmail: "alice2@example.com", amount: 300, description: "Transport", category: "Transport" },
  { payerEmail: "charlie@example.com", amount: 600, description: "Activities", category: "Entertainment" },
  { payerEmail: "bob@example.com", amount: 150, description: "Food", category: "Food" },
];

const createUsers = async () => {
  const createdUsers = {};

  for (const userData of usersToCreate) {
    let user = await User.findOne({ email: userData.email });
    if (user) {
      console.log(`User already exists: ${userData.email}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      });
      console.log(`Created user: ${userData.email}`);
    }
    createdUsers[userData.email] = user;
  }

  return createdUsers;
};

const findExistingExpense = async (expenseData) => {
  const existing = await Expense.findOne({
    paidBy: expenseData.paidBy,
    amount: expenseData.amount,
    description: expenseData.description,
    category: expenseData.category,
  }).populate("participants.user");

  if (!existing) return null;

  const existingParticipantIds = existing.participants.map((p) => p.user._id.toString()).sort();
  const newParticipantIds = expenseData.participants.map((p) => p.user.toString()).sort();
  const sharesMatch = existing.participants.every((p, idx) => p.share === expenseData.participants[idx].share);

  if (
    existingParticipantIds.length === newParticipantIds.length &&
    existingParticipantIds.every((id, idx) => id === newParticipantIds[idx]) &&
    sharesMatch
  ) {
    return existing;
  }

  return null;
};

const addExpenses = async () => {
  try {
    await connectDB();

    const users = await createUsers();
    const userIds = Object.values(users).map((user) => user._id.toString());

    console.log("\nAdding expenses...\n");

    for (const expense of expenses) {
      const payer = users[expense.payerEmail];
      const sharePerPerson = expense.amount / userIds.length;
      const participants = userIds.map((userId) => ({ user: userId, share: sharePerPerson }));

      const expenseData = {
        paidBy: payer._id,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        participants,
      };

      const existingExpense = await findExistingExpense(expenseData);
      if (existingExpense) {
        console.log(`Skipped existing expense: ${expense.description} paid by ${payer.name}`);
        continue;
      }

      await Expense.create(expenseData);
      console.log(`Added expense: ${payer.name} paid ₹${expense.amount} for ${expense.description}`);
    }

    console.log("\n✓ User accounts and expenses are now created.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

addExpenses();
