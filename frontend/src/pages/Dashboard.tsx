import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteExpense, fetchExpenses, ExpenseResponse } from "../api/expenses";
import { getErrorMessage } from "../api/api";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchExpenses();
        setExpenses(list);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="page-shell">
      <div className="app-header">
        <div>
          <h1>Expense splitter</h1>
          <p>Welcome back, {user?.name}.</p>
        </div>
        <div className="button-group">
          <Link className="button" to="/add-expense">
            Add expense
          </Link>
          <Link className="button button-secondary" to="/settlements">
            Settlements
          </Link>
          <button className="button button-danger" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <section className="dashboard-summary">
        <div>
          <p>Total expenses</p>
          <strong>{expenses.length}</strong>
        </div>
        <div>
          <p>Total spent</p>
          <strong>₹{total.toFixed(2)}</strong>
        </div>
      </section>

      <section className="card list-card">
        <h2>Expenses</h2>
        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses yet. Add one to get started.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Paid by</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.description || "—"}</td>
                    <td>₹{expense.amount.toFixed(2)}</td>
                    <td>{expense.category || "Other"}</td>
                    <td>{expense.paidBy.name}</td>
                    <td>{expense.participants.length}</td>
                    <td>
                      <button className="button button-secondary" onClick={() => handleDelete(expense._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
