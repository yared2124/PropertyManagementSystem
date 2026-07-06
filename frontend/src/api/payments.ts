import api from "./client";
import { Payment } from "../types";

export const paymentApi = {
  getAll: (params?: { contractId?: string; status?: string }) =>
    api.get<{ data: Payment[] }>("/payments", { params }),

  getById: (id: string) => api.get<{ data: Payment }>(`/payments/${id}`),

  process: (data: {
    contractId: string;
    amount: number;
    method: string;
    paymentDate: string;
  }) => api.post<{ data: Payment }>("/payments", data),

  refund: (id: string) => api.post(`/payments/${id}/refund`),

  createStripeIntent: (data: { amount: number; contractId: string }) =>
    api.post<{ data: { clientSecret: string; paymentIntentId: string } }>(
      "/payments/create-intent",
      data,
    ),
};
