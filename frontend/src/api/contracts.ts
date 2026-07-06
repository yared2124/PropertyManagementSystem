import api from "./client";
import { Contract } from "../types";

export const contractApi = {
  getAll: (params?: { status?: string; tenantId?: string }) =>
    api.get<{ data: Contract[] }>("/contracts", { params }),

  getById: (id: string) => api.get<{ data: Contract }>(`/contracts/${id}`),

  create: (data: Omit<Contract, "id" | "contractNumber" | "totalAmount">) =>
    api.post<{ data: Contract }>("/contracts", data),

  update: (id: string, data: Partial<Contract>) =>
    api.put<{ data: Contract }>(`/contracts/${id}`, data),

  delete: (id: string) => api.delete(`/contracts/${id}`),
};
