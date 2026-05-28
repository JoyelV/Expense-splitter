import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) {
      return "Unauthorized: please check your email and password, then try signing in again.";
    }
    if (status === 403) {
      return "Access denied: you do not have permission to complete this action.";
    }
    if (status === 400) {
      return error.response?.data?.message || "Invalid request. Please correct your input and try again.";
    }
    return error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.";
  }
  return (error as Error).message || "An unknown error occurred.";
};

export default api;
