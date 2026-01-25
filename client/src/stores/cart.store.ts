import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { CartItem, Item } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Item) => void;
  changeQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product: Item) => {
          const { items } = get();
          const existingItem = items.find((p) => p.id === product.id);

          if (existingItem) {
            set({
              items: items.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
              ),
            });
          } else {
            set({
              items: [...items, { ...product, quantity: 1 }],
            });
          }
        },

        changeQuantity: (productId: string, delta: number) =>
          set((state) => ({
            items: state.items.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    quantity: Math.max(1, product.quantity + delta),
                  }
                : product,
            ),
          })),

        removeItem: (productId: string) =>
          set((state) => ({
            items: state.items.filter((product) => product.id !== productId),
          })),

        clearItems: () => set({ items: [] }),

        getTotalPrice: () =>
          get().items.reduce((sum, p) => sum + p.price * p.quantity, 0),

        getTotalQuantity: () =>
          get().items.reduce((sum, p) => sum + p.quantity, 0),
      }),
      { name: "product-storage" },
    ),
  ),
);
