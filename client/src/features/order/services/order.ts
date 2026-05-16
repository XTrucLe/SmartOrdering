import { apiClient, endpoints, OrderService } from "@/lib/api";
import { ORDER_STATUS, OrderStatus } from "../constants/order.constant";

export const getOrders = async () => {
  const response = await apiClient.get(endpoints.order.getByStaff);
  return response;
};

export const transitToNextStatus = async (
  orderId: string,
  nextStatus: OrderStatus,
  reason?: string,
): Promise<boolean> => {
  const transitionStrategies: Partial<
    Record<OrderStatus, () => Promise<unknown>>
  > = {
    [ORDER_STATUS.COMPLETED]: () => OrderService.completeOrder(orderId),

    [ORDER_STATUS.CANCELLED]: () => {
      if (!reason?.trim()) {
        throw new Error(
          "Lý do hủy đơn hàng là bắt buộc (Reason is required for cancellation).",
        );
      }
      return OrderService.cancelOrder(orderId, reason.trim());
    },
  };

  const executeApiCall = transitionStrategies[nextStatus];

  if (!executeApiCall) {
    throw new Error(
      `Hệ thống không hỗ trợ hoặc chưa cấu hình API dịch chuyển sang trạng thái: ${nextStatus}`,
    );
  }

  await executeApiCall();
  return true;
};
