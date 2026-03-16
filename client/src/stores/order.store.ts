import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { OrderedItem, Item } from "@/types";
import {
  addItemLogic,
  changeQuantityLogic,
  removeItemLogic,
  getTotalPrice,
} from "./order.logic";

interface OrderStore {
  items: OrderedItem[];

  addItem: (product: Item) => void;
  changeQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;

  totalPrice: () => number;
}

export const useOrderStore = create<OrderStore>()(
  devtools((set, get) => ({
    items: [],

    addItem: (product) =>
      set((state) => ({
        items: addItemLogic(state.items, product),
      })),

    changeQuantity: (id, delta) =>
      set((state) => ({
        items: changeQuantityLogic(state.items, id, delta),
      })),

    removeItem: (id) =>
      set((state) => ({
        items: removeItemLogic(state.items, id),
      })),

    clear: () => set({ items: [] }),

    totalPrice: () => getTotalPrice(get().items),
  })),
);
