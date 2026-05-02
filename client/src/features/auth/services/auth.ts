import { apiClient, endpoints } from "@/lib/api";

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post(endpoints.auth.login, data);
    return res.data;
  },

  getMyInfo: async () => {
    const res = await apiClient.get(endpoints.profile.me);
    return res.data;
  },

  logout: async () => {
    await apiClient.post(endpoints.auth.logout);
  },
};
