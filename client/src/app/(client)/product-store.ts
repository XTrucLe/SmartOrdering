import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { SelectedProduct } from "@/types";

interface ProductStore {
  selectedProducts: SelectedProduct[];
  totalPrice: () => number;
  selectProduct: (product: SelectedProduct) => void;
  changeQuantity: (productId: string, delta: number) => void;
  removeProduct: (productId: string) => void;
  clearSelectedProducts: () => void;
}

export const useProductStore = create<ProductStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedProducts: [],
        totalPrice: () => {
          return get().selectedProducts.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
          );
        },
        selectProduct: (product: SelectedProduct) =>
          set((state) => ({
            selectedProducts: [...state.selectedProducts, product],
          })),
        changeQuantity: (productId: string, delta: number) =>
          set((state) => {
            const updatedProducts = state.selectedProducts.map((product) => {
              if (product.id === productId) {
                return {
                  ...product,
                  quantity: Math.max(1, product.quantity + delta),
                };
              }
              return product;
            });
            return {
              selectedProducts: updatedProducts,
            };
          }),
        removeProduct: (productId: string) =>
          set((state) => ({
            selectedProducts: state.selectedProducts.filter(
              (product) => product.id !== productId,
            ),
            total: state.selectedProducts
              .filter((product) => product.id !== productId)
              .reduce(
                (sum, product) => sum + product.price * product.quantity,
                0,
              ),
          })),
        clearSelectedProducts: () => set({ selectedProducts: [] }),
      }),
      {
        name: "product-storage",
      },
    ),
  ),
);
