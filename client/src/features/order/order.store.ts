import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Item } from "@/features/menu/types";
import {
  addItemLogic,
  changeQuantityLogic,
  removeItemLogic,
  getTotalPrice,
} from "./order.logic";
import { DeliveryMethod, OrderItem } from "./types";
import { Table } from "../areas/types";

interface OrderStore {
  items: OrderItem[];
  table: Table | null;
  method: DeliveryMethod;

  addItem: (product: Item) => void;
  setTable: (table: Table) => void;
  setMethod: (method: DeliveryMethod) => void;
  changeQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;

  totalPrice: () => number;
}

export const useOrderStore = create<OrderStore>()(
  devtools((set, get) => ({
    items: [],
    table: null,
    method: "Dine-in",

    addItem: (product) =>
      set((state) => ({
        items: addItemLogic(state.items, product),
      })),
    setTable: (table) => set({ table }),
    setMethod: (method) => set({ method }),
    changeQuantity: (id, delta) =>
      set((state) => ({
        items: changeQuantityLogic(state.items, id, delta),
      })),

    removeItem: (id) =>
      set((state) => ({
        items: removeItemLogic(state.items, id),
      })),

    clear: () => set({ items: [], table: null }),

    totalPrice: () => getTotalPrice(get().items),
  })),
);
