import { create } from "zustand";

import { devtools } from "zustand/middleware";

import {
  addItemLogic,
  changeQuantityLogic,
  removeItemLogic,
  getTotalPrice,
} from "./order.logic";

import { OrderItemPayload, DeliveryMethod, OrderItem } from "./types";

import { Table } from "../areas/types";

interface OrderStore {
  items: OrderItem[];
  table: Table | null;
  method: DeliveryMethod;

  addItem: (payload: OrderItemPayload) => void;
  setTable: (table: Table) => void;
  setMethod: (method: DeliveryMethod) => void;
  changeQuantity: (signature: string, delta: number) => void;
  removeItem: (signature: string) => void;
  clear: () => void;
  totalPrice: () => number;
}

export const useOrderStore = create<OrderStore>()(
  devtools((set, get) => ({
    items: [],
    table: null,
    method: "Dine-in",

    addItem: (payload) =>
      set((state) => ({
        items: addItemLogic(state.items, payload),
      })),
    setTable: (table) => set({ table }),
    setMethod: (method) => set({ method }),
    changeQuantity: (signature, delta) =>
      set((state) => ({
        items: changeQuantityLogic(state.items, signature, delta),
      })),

    removeItem: (signature) =>
      set((state) => ({
        items: removeItemLogic(state.items, signature),
      })),

    clear: () =>
      set({
        items: [],
        table: null,
      }),

    totalPrice: () => getTotalPrice(get().items),
  })),
);
