const calculateSettlements = (users) => {
  const balances = users.reduce((acc, user) => {
    acc[user.name] = (acc[user.name] || 0) + user.balance;
    return acc;
  }, {});

  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([name, amount]) => {
    if (amount > 0) {
      creditors.push({ name, amount });
    } else if (amount < 0) {
      debtors.push({ name, amount: Math.abs(amount) });
    }
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: Number(amount.toFixed(2)),
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 1e-9) {
      i += 1;
    }
    if (Math.abs(creditor.amount) < 1e-9) {
      j += 1;
    }
  }

  return settlements;
};

const calculateEqualSplitSettlements = (payments) => {
  const participantNames = Array.from(new Set(payments.map((payment) => payment.payer))).sort();
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const fairShare = totalSpent / participantNames.length;

  const balances = participantNames.map((name) => {
    const paid = payments
      .filter((payment) => payment.payer === name)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      name,
      balance: Number((paid - fairShare).toFixed(2)),
    };
  });

  return {
    totalSpent,
    fairShare: Number(fairShare.toFixed(2)),
    settlements: calculateSettlements(balances),
  };
};

module.exports = { calculateSettlements, calculateEqualSplitSettlements };
