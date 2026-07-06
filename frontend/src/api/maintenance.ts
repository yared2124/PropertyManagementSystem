import api from "./client";
import { Maintenance } from "../types";

export const maintenanceApi = {
  getAll: (params?: {
    status?: string;
    priority?: string;
    assetType?: string;
  }) => api.get<{ data: Maintenance[] }>("/maintenance", { params }),

  getById: (id: string) => api.get<{ data: Maintenance }>(`/maintenance/${id}`),

  create: (data: Omit<Maintenance, "id" | "ticketNumber">) =>
    api.post<{ data: Maintenance }>("/maintenance", data),

  updateStatus: (id: string, status: string) =>
    api.put<{ data: Maintenance }>(`/maintenance/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/maintenance/${id}`),
};
