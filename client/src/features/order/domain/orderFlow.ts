import { ORDER_STATUS, OrderStatus } from "../constants/order.constant";

export const orderFlow: Record<
    OrderStatus,
    { to: OrderStatus[] }
> = {
    [ORDER_STATUS.PENDING]: {
        to: [ORDER_STATUS.PROCESSING],
    },
    [ORDER_STATUS.PROCESSING]: {
        to: [ORDER_STATUS.READY],
    },
    [ORDER_STATUS.READY]: {
        to: [ORDER_STATUS.COMPLETED],
    },
    [ORDER_STATUS.COMPLETED]: {
        to: [],
    },
    [ORDER_STATUS.CANCELLED]: {
        to: [],
    },
};