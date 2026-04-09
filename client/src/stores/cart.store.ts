import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import { OrderedItem, Item } from "@/types";
import {
  addItemLogic,
  changeQuantityLogic,
  removeItemLogic,
  getTotalPrice,
  getTotalQuantity,
} from "./order.logic";

interface CartStore {
  items: OrderedItem[];

  addItem: (product: Item) => void;
  changeQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;

  totalPrice: () => number;
  totalQuantity: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
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

        totalQuantity: () => getTotalQuantity(get().items),
      }),
      { name: "cart-storage" },
    ),
  ),
);
