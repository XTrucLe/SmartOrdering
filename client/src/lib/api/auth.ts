import { apiClient } from "./api";

export const AuthService = {
  logout: async () => {
    apiClient.post("/auth/logout");
  },
};
