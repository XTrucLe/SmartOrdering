import { apiClient, endpoints } from "@/lib/api";

export const getAllSections = async () => {
  const response = await apiClient.get(endpoints.section.root);
  return response.data;
};
