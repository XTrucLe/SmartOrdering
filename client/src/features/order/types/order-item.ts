import { Item } from "@/features/menu/types";

export type OrderItem = Item & {
  quantity: number;
};
