import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSettlements, SettlementResponse } from "../api/expenses";
import { getErrorMessage } from "../api/api";

const Settlements = () => {
  const [settlements, setSettlements] = useState<SettlementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSettlements();
        setSettlements(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="page-shell">
      <div className="app-header">
        <div>
          <h1>Settlements</h1>
          <p>See how much each member owes and who needs to pay.</p>
        </div>
        <div className="button-group">
          <Link className="button button-secondary" to="/">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="card list-card">
        {loading ? (
          <p>Loading settlements...</p>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : settlements.length === 0 ? (
          <p>No settlements to settle yet.</p>
        ) : (
          <ul className="settlement-list">
            {settlements.map((item, index) => (
              <li key={index}>
                <span>
                  <strong>{item.from}</strong> pays <strong>{item.to}</strong>
                </span>
                <span>₹{item.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Settlements;
