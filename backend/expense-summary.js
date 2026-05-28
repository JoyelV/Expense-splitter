const { calculateEqualSplitSettlements } = require("./utils/settlement");

const payments = [
  { payer: "Alice", amount: 1200, description: "hotel" },
  { payer: "Bob", amount: 450, description: "food" },
  { payer: "Alice", amount: 300, description: "transport" },
  { payer: "Charlie", amount: 600, description: "activities" },
  { payer: "Bob", amount: 150, description: "food" },
];

const report = calculateEqualSplitSettlements(payments);

console.log("Expense Splitter Summary");
console.log("=========================");
console.log(`Total spent: ₹${report.totalSpent.toFixed(2)}`);
console.log(`Fair share per person: ₹${report.fairShare.toFixed(2)}`);
console.log("\nSettlement:");

if (report.settlements.length === 0) {
  console.log("  Everyone is even. No settlements are necessary.");
} else {
  report.settlements.forEach((settlement) => {
    console.log(`  ${settlement.from} pays ${settlement.to}: ₹${settlement.amount.toFixed(2)}`);
  });
}
