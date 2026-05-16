import { apiClient, endpoints } from "@/lib/api";

export const checkStore = async (slug: string) => {
  try {
    const response = await apiClient.get(endpoints.stores.check_slug(slug));
    return !!response.data;
  } catch (error) {
    console.error("Error checking store:", error);
    return false;
  }
};

export const getMyStore = async () => {
  const response = await apiClient.get(endpoints.stores.mine);

  const myStore = response.data;
  return myStore;
};

export const getMyStoreRole = async () => {
  const response = await apiClient.get(endpoints.store_member.membership);
  const myMembership = response.data;
  return myMembership.role;
};
