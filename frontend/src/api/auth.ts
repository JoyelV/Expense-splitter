import api from "./api";

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

export const registerRequest = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/register", { name, email, password });
  return response.data;
};

export const verifyToken = async (): Promise<{ _id: string; name: string; email: string }> => {
  const response = await api.get("/api/auth/me");
  return response.data;
};
