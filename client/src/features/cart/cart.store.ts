import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import {
  addItemLogic,
  changeQuantity,
  createOptionSignature,
  debouncedSync,
  handleConfirmOrder,
  removeItem,
  syncOrder,
} from "./cart.service";
import { DeliveryType, OrderStatus } from "../order/constants/order.constant";
import { CartItem, CartItemPayload } from "./types";
import { CreateOrderRequest, Customer, Order } from "../order/types";

interface CartState {
  orderId?: string;
  orderCode?: string;
  customer: Customer | null;
  items: CartItem[];
  method: DeliveryType;
  status: OrderStatus;

  loadEntity: (order: Order) => Promise<void>;
  addItem: (payload: CartItemPayload) => void;
  setCustomer: (payload: Partial<Customer>) => void;
  setMethod: (method: DeliveryType) => void;
  changeQuantity: (signature: string, delta: number) => void;
  removeItem: (removeId: string, signature: string) => void;
  getTotalAmount: () => number;
  confirmOrder: () => Promise<boolean>;
  syncOrder: () => Promise<boolean>;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          orderId: undefined,
          orderCode: undefined,
          customer: null,
          items: [],
          method: "DINE_IN",
          status: "DRAFT",

          loadEntity: async (order) => {
            set({
              orderId: order.id,
              orderCode: order.orderCode,
              customer: {
                name: order.customerName || "Khách lẻ",
                phoneNumber: order.customerPhone ?? undefined,
              },
              items: order.orderItems.map((item) => ({
                ...item,
                signature: createOptionSignature(item.options),
              })),
              method: order.deliveryMethod,
              status: order.status,
            });
          },

          addItem: (payload) =>
            set((state) => ({
              items: addItemLogic(state.items, payload),
            })),

          changeQuantity: (signature, delta) =>
            set((state) => ({
              items: changeQuantity(state.items, signature, delta),
            })),

          removeItem: (removeId, signature) =>
            set((state) => ({
              items: removeItem(state.items, removeId, signature),
            })),

          setCustomer: (payload) =>
            set((state) => ({
              customer: { ...state.customer, ...payload } as Customer,
            })),

          setMethod: (method) => set({ method }),

          getTotalAmount: () =>
            get().items.reduce((sum, item) => sum + item.totalPrice, 0),

          confirmOrder: async (): Promise<boolean> => {
            const confirm = await handleConfirmOrder();
            if (confirm) get().clear();

            return confirm;
          },

          syncOrder: async (): Promise<boolean> => {
            const { orderId, items, customer, method } = get();
            if (!orderId) return false;

            const syncData: Partial<CreateOrderRequest> = {
              items: items.map(({ itemId, quantity, options }) => ({
                itemId,
                quantity,
                options,
              })),
              ...(customer && {
                ...(customer.name?.trim() && {
                  customerName: customer.name.trim(),
                }),
                ...(customer.phoneNumber?.trim() && {
                  customerPhone: customer.phoneNumber.trim(),
                }),
              }),
              deliveryMethod: method,
            };

            try {
              await syncOrder(syncData, orderId);
              return true;
            } catch (error) {
              return false;
            }
          },

          clear: () =>
            set({
              orderId: undefined,
              orderCode: undefined,
              items: [],
              customer: null,
              method: "DINE_IN",
              status: "DRAFT",
            }),
        }),
        {
          name: "pos-cart-storage",
          partialize: (state) => ({
            items: state.items,
            customer: state.customer,
          }),
        },
      ),
    ),
    {
      name: "pos-cart-storage",
    },
  ),
);

useCartStore.subscribe(
  (state) =>
    [state.items, state.customer, state.method, state.orderId] as const,
  (curr, prev) => {
    const [items, customer, method, orderId] = curr;
    const [oldItems, oldCustomer, oldMethod, oldOrderId] = prev;

    if (!oldOrderId) return;

    console.log(method, oldMethod);

    if (
      orderId &&
      (items !== oldItems || customer !== oldCustomer || method !== oldMethod)
    ) {
      const syncData: Partial<CreateOrderRequest> = {
        ...(items !== oldItems && {
          items: items.map(({ itemId, quantity, options }) => ({
            itemId,
            quantity,
            options,
          })),
        }),
        ...(customer !== oldCustomer &&
          customer && {
            ...(customer.name?.trim() && {
              customerName: customer.name.trim(),
            }),

            ...(customer.phoneNumber?.trim() && {
              customerPhone: customer.phoneNumber.trim(),
            }),
          }),
        ...(method !== oldMethod && { deliveryMethod: method }),
      };

      debouncedSync(syncData, orderId);
    }
  },
);
