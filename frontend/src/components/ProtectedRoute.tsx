import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, initialized } = useAuth();

  if (!initialized) {
    return <div className="page-shell">
      <div className="spinner" />
      <p>Checking authentication...</p>
    </div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
