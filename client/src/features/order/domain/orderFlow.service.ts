import { orderFlow } from "./orderFlow";
import { OrderStatus } from "../constants/order.constant";

export function getNextStatuses(status: OrderStatus): OrderStatus[] {
    return orderFlow[status]?.to ?? [];
}

export function canTransition(
    from: OrderStatus,
    to: OrderStatus
): boolean {
    return orderFlow[from]?.to?.includes(to) ?? false;
}

export async function transition(
    from: OrderStatus,
    to: OrderStatus,
    ctx: { orderId: string }
): Promise<OrderStatus> {
    if (!canTransition(from, to)) {
        throw new Error(`Invalid transition: ${from} → ${to}`);
    }

    console.log("transition", ctx.orderId, from, "→", to);

    return to;
}