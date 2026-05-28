const User = require("./models/User");
const Expense = require("./models/Expense");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const addExpenses = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get user IDs
    const alice = await User.findOne({ email: "alice2@example.com" });
    const bob = await User.findOne({ email: "bob@example.com" });
    const charlie = await User.findOne({ email: "charlie@example.com" });

    if (!alice || !bob || !charlie) {
      console.error("One or more users not found!");
      process.exit(1);
    }

    console.log("User IDs found:");
    console.log(`Alice: ${alice._id}`);
    console.log(`Bob: ${bob._id}`);
    console.log(`Charlie: ${charlie._id}\n`);

    const userIds = [alice._id.toString(), bob._id.toString(), charlie._id.toString()];

    const expenses = [
      { payer: alice, amount: 1200, description: "Hotel", category: "Accommodation" },
      { payer: bob, amount: 450, description: "Food", category: "Food" },
      { payer: alice, amount: 300, description: "Transport", category: "Transport" },
      { payer: charlie, amount: 600, description: "Activities", category: "Entertainment" },
      { payer: bob, amount: 150, description: "Food", category: "Food" },
    ];

    console.log("Adding expenses...\n");

    for (const expense of expenses) {
      // Calculate equal share for each participant
      const sharePerPerson = expense.amount / 3;

      const expenseData = {
        paidBy: expense.payer._id,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        participants: userIds.map((userId) => ({
          user: userId,
          share: sharePerPerson,
        })),
      };

      try {
        const createdExpense = await Expense.create(expenseData);
        console.log(`✓ Added: ${expense.payer.name} paid ₹${expense.amount} for ${expense.description}`);
      } catch (error) {
        console.error(`✗ Failed to add expense: ${error.message}`);
      }
    }

    console.log("\n✓ All expenses added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

addExpenses();
