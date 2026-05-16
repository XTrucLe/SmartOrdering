import { CreateOrderRequest } from "@/features/order/types";
import { apiClient } from "./api";

const prefix = "/orders";

export const OrderService = {
  openBill: () => apiClient.post(`${prefix}/draft`),
  updateBill: (id: string, data: Partial<CreateOrderRequest>, options?: any) =>
    apiClient.put(`${prefix}/draft/${id}`, data, { ...options, timeout: 5000 }),
  getBill: (id: string) => apiClient.get(`${prefix}/draft/${id}`),
  getAllBill: () => apiClient.get(`${prefix}/draft`),

  payWithCash: (id: string) => apiClient.patch(`${prefix}/${id}/pay/cash`),
  confirmOrder: (id: string) => apiClient.patch(`${prefix}/${id}/confirm`),
  completeOrder: (id: string) => apiClient.patch(`${prefix}/${id}/complete`),

  getOrder: (id: string) => apiClient.get(`${prefix}/${id}`),

  payAndCompleteOrder: (id: string) =>
    apiClient.patch(`${prefix}/${id}/complete-and-pay`),

  cancelOrder: (id: string, reason: string) =>
    apiClient.patch(`${prefix}/${id}/cancel`, { reason }),
};
