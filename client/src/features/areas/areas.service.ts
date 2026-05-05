import { apiClient, endpoints } from "@/lib/api";
import { TableGrouped } from "./types";

export const getAreas = async (): Promise<TableGrouped[]> => {
  const response = await apiClient.get(endpoints.table.grouped);
  return response.data;
};
