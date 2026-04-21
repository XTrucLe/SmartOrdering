import { apiClient, endpoints } from "@/lib/api";

export const checkStore = async (slug: string) => {
    try {
        const response = await apiClient.get(endpoints.stores.check_slug(slug));
        return !!response.data;
    } catch (error) {
        console.error("Error checking store:", error);
        return false
    }
}