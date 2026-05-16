import { orderFlow } from "./orderFlow";
import { ORDER_STATUS, OrderStatus } from "../constants/order.constant";
import { transitToNextStatus } from "../services/order";
import { toast } from "sonner";
import { useOrderStore } from "../order.store";

export function getNextStatuses(status: OrderStatus): OrderStatus[] {
  return orderFlow[status]?.to ?? [];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return orderFlow[from]?.to?.includes(to) ?? false;
}

export async function transition(
  from: OrderStatus,
  to: OrderStatus,
  ctx: { orderId: string },
): Promise<OrderStatus> {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid transition: ${from} → ${to}`);
  }

  try {
    await transitToNextStatus(ctx.orderId, to);
    useOrderStore.getState().removeOrder(ctx.orderId);
    toast.success(
      messagesTransit[to] ?? "Trạng thái đơn hàng đã được cập nhật thành công!",
    );
  } catch (error) {
    console.error(
      `Failed to transition order ${ctx.orderId} from ${from} to ${to}:`,
      error,
    );
    throw new Error(
      `Failed to transition order: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return to;
}

const messagesTransit: Partial<Record<OrderStatus, string>> = {
  [ORDER_STATUS.COMPLETED]: "Đơn hàng đã hoàn thành.",
  [ORDER_STATUS.CANCELLED]: "Đơn hàng đã bị hủy.",
};
