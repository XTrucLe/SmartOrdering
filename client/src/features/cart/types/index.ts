import { Item } from "@/features/menu/types";

export type CartItem = Item & {
    quantity: number;
};