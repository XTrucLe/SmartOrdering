import { StoreStatus } from "../types";

export const StatusColor: Record<StoreStatus, string> = {
  ACTIVE: "bg-success",
  PENDING: "bg-pending",
  REJECTED: "bg-destructive",
  SUSPENDED: "bg-warning",
};
