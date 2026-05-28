import api from "./api";

export interface ParticipantPayload {
  user: string;
  share: number;
}

export interface ExpensePayload {
  amount: number;
  description: string;
  category: string;
  participants: ParticipantPayload[];
}

export interface ExpenseResponse {
  _id: string;
  paidBy: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  description: string;
  category: string;
  participants: ParticipantPayload[];
  createdAt: string;
}

export interface SettlementResponse {
  from: string;
  to: string;
  amount: number;
}

export const fetchExpenses = async (): Promise<ExpenseResponse[]> => {
  const response = await api.get("/api/expenses");
  return response.data;
};

export const createExpense = async (payload: ExpensePayload): Promise<ExpenseResponse> => {
  const response = await api.post("/api/expenses", payload);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/api/expenses/${id}`);
};

export const fetchSettlements = async (): Promise<SettlementResponse[]> => {
  const response = await api.get("/api/expenses/settlements");
  return response.data;
};
