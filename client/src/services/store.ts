import { apiClient, endpoints } from "./base";

export const storeService = {
    getStore: async (storeId: string) => {
        try {
            const response = await apiClient.get(endpoints.stores.detail(storeId));
            return response.data;
        } catch (error) {
            console.error("Error fetching store data:", error);
            throw error;
        }
    },
    getStores: async (storeSlug: string) => {
        try {
            const response = await apiClient.get(endpoints.stores.search(storeSlug));
            return response.data;
        } catch (error) {
            console.error("Error fetching stores data:", error);
            throw error;
        }
    }
};