import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { token, initialized } = useAuth();

  if (!initialized) {
    return <Spinner message="Checking authentication..." />;
  }

  return token ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
