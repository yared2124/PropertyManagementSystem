import api from "./client";
import { Property } from "../types";

export const propertyApi = {
  getAll: (params?: { status?: string; city?: string; assetType?: string }) =>
    api.get<{ data: Property[] }>("/properties", { params }),

  getById: (id: string) => api.get<{ data: Property }>(`/properties/${id}`),

  create: (data: Omit<Property, "id" | "createdAt" | "updatedAt">) =>
    api.post<{ data: Property }>("/properties", data),

  update: (id: string, data: Partial<Property>) =>
    api.put<{ data: Property }>(`/properties/${id}`, data),

  delete: (id: string) => api.delete(`/properties/${id}`),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<{ data: any }>(`/properties/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getImages: (id: string) =>
    api.get<{ data: any[] }>(`/properties/${id}/images`),
};
