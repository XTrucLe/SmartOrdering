import { OrderService } from "@/lib/api/order";
import { toast } from "sonner";

export const payOrderByCash = async (orderId: string) => {
  try {
    await OrderService.payWithCash(orderId);

    toast.success("Thanh toán thành công");
  } catch (error) {
    toast.error("Thanh toán thất bại");
    throw error;
  }
};

export const completeOrder = async (orderId: string) => {
  try {
    await OrderService.completeOrder(orderId);
  } catch (error) {
    throw error;
  }
};
