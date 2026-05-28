import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createExpense, ParticipantPayload } from "../api/expenses";
import { getErrorMessage } from "../api/api";

const emptyParticipant = (): ParticipantPayload => ({ user: "", share: 0 });

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [participants, setParticipants] = useState<ParticipantPayload[]>([emptyParticipant()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalShares = useMemo(
    () => participants.reduce((sum, participant) => sum + participant.share, 0),
    [participants]
  );

  const updateParticipant = (index: number, field: keyof ParticipantPayload, value: string | number) => {
    setParticipants((current) =>
      current.map((participant, position) =>
        position === index ? { ...participant, [field]: field === "share" ? Number(value) : String(value) } : participant
      )
    );
  };

  const addParticipant = () => {
    setParticipants((current) => [...current, emptyParticipant()]);
  };

  const removeParticipant = (index: number) => {
    setParticipants((current) => current.filter((_, position) => position !== index));
  };

  const sanitizeAmountValue = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return `${parts[0]}.${parts[1]}`;
    }
    return cleaned;
  };

  const handleAmountChange = (value: string) => {
    const sanitized = sanitizeAmountValue(value);
    setAmount(sanitized ? Number(sanitized) : 0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (participants.length === 0) {
      setError("At least one participant is required.");
      return;
    }

    if (totalShares !== amount) {
      setError("Participant shares must exactly total the expense amount.");
      return;
    }

    if (participants.some((participant) => !participant.user || participant.share <= 0)) {
      setError("Each participant must have a valid user ID and a positive share.");
      return;
    }

    try {
      setLoading(true);
      await createExpense({ amount, description, category, participants });
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="app-header">
        <div>
          <h1>Add expense</h1>
          <p>Securely add a new expense and share costs with your group.</p>
        </div>
        <div className="button-group">
          <Link className="button button-secondary" to="/">
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <label>
            Amount
            <input
              type="text"
              inputMode="decimal"
              value={amount === 0 ? "" : amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              required
            />
          </label>
          <label>
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} required />
          </label>

          <div className="section-header">
            <h2>Participants</h2>
            <button type="button" className="button button-secondary" onClick={addParticipant}>
              Add participant
            </button>
          </div>

          {participants.map((participant, index) => (
            <div key={index} className="participant-row">
              <input
                placeholder="User ID"
                value={participant.user}
                onChange={(e) => updateParticipant(index, "user", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Share"
                value={participant.share}
                onChange={(e) => updateParticipant(index, "share", Number(e.target.value))}
                min="0"
                step="0.01"
                required
              />
              <button
                type="button"
                className="button button-danger small"
                onClick={() => removeParticipant(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="share-summary">
            <span>Total shares: ₹{totalShares.toFixed(2)}</span>
            <span>Target amount: ₹{amount.toFixed(2)}</span>
          </div>

          {error && <div className="alert">{error}</div>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Saving expense..." : "Save expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
