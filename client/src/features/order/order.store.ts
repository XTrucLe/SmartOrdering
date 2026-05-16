import { create } from "zustand";
import { Order } from "./types";
import { toast } from "sonner";
import { getOrders } from "./services/order";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;

  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order) => void;
  fetchOrders: () => Promise<void>;
  removeOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,

  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  fetchOrders: async () => {
    try {
      const { data } = await getOrders();
      get().setOrders(data);
    } catch (error) {
      toast.error("Có lỗi khi tải đơn hàng!");
    }
  },
  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
      selectedOrder:
        state.selectedOrder?.id === orderId ? null : state.selectedOrder,
    })),
}));
