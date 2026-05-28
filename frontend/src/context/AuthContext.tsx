import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest, verifyToken } from "../api/auth";
import { getErrorMessage, setAuthToken } from "../api/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("expense-splitter-token");
      const storedUser = localStorage.getItem("expense-splitter-user");

      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }

      if (storedToken) {
        try {
          const verifiedUser = await verifyToken();
          setUser(verifiedUser);
          localStorage.setItem("expense-splitter-user", JSON.stringify(verifiedUser));
        } catch {
          setToken(null);
          setUser(null);
          localStorage.removeItem("expense-splitter-token");
          localStorage.removeItem("expense-splitter-user");
          setAuthToken(null);
        }
      }

      setInitialized(true);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("expense-splitter-token", response.token);
      localStorage.setItem("expense-splitter-user", JSON.stringify(response.user));
      setAuthToken(response.token);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerRequest(name, email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("expense-splitter-token", response.token);
      localStorage.setItem("expense-splitter-user", JSON.stringify(response.user));
      setAuthToken(response.token);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("expense-splitter-token");
    localStorage.removeItem("expense-splitter-user");
    setAuthToken(null);
    navigate("/login");
  }, [navigate]);

  const value = useMemo(
    () => ({ user, token, loading, error, initialized, login, register, logout }),
    [user, token, loading, error, initialized, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
