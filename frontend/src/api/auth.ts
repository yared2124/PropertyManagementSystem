import api from "./client";
import { User } from "../types";

export const authApi = {
  register: (data: Omit<User, "id"> & { password: string }) =>
    api.post<{ data: User }>("/auth/register", data),

  login: (email: string, password: string) =>
    api.post<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>("/auth/login", { email, password }),

  refreshToken: (refreshToken: string) =>
    api.post<{ data: { accessToken: string; refreshToken: string } }>(
      "/auth/refresh-token",
      { refreshToken },
    ),

  logout: () => api.post("/auth/logout"),
};
