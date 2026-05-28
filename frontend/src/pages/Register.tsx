import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/api";

const Register = () => {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!name || !email || !password) {
      setSubmitError("Name, email, and password are required");
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h1>Create account</h1>
        <p>Register with secure credentials and start tracking expenses.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          {(submitError || error) && <div className="alert">{submitError || error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create account"}
          </button>
        </form>
        <p className="form-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
