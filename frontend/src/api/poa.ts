import api from "./client";
import { POA } from "../types";

export const poaApi = {
  getAll: (params?: { status?: string }) =>
    api.get<{ data: POA[] }>("/poa", { params }),

  getById: (id: string) => api.get<{ data: POA }>(`/poa/${id}`),

  create: (data: Omit<POA, "id" | "poaNumber">) =>
    api.post<{ data: POA }>("/poa", data),

  update: (id: string, data: Partial<POA>) =>
    api.put<{ data: POA }>(`/poa/${id}`, data),

  delete: (id: string) => api.delete(`/poa/${id}`),
};
