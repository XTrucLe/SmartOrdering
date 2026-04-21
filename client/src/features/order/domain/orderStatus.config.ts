import { ORDER_STATUS } from "../constants/order.constant";

export const ORDER_STATUS_UI = {
    [ORDER_STATUS.PENDING]: {
        border: "border-l-pending",
        badge: "bg-pending text-muted",
    },
    [ORDER_STATUS.PROCESSING]: {
        border: "border-l-primary",
        badge: "bg-primary/10 text-primary",
    },
    [ORDER_STATUS.READY]: {
        border: "border-l-success",
        badge: "bg-success/10 text-success",
    },
    [ORDER_STATUS.CANCELLED]: {
        border: "border-l-destructive",
        badge: "bg-destructive/10 text-destructive",
    },
    [ORDER_STATUS.COMPLETED]: {
        border: "border-l-muted-foreground",
        badge: "bg-muted text-muted-foreground",
    },
} as const;