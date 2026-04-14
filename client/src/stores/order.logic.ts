import { Item, OrderedItem } from "@/types";
import { toast } from "sonner";

export const addItemLogic = (items: OrderedItem[], product: Item) => {
  const existing = items.find((i) => i.id === product.id);

  if (existing) {
    toast.error("Món này đã có trong giỏ hàng. Vui lòng tăng số lượng.");
    return items;
  }

  toast.success(`${product.name} đã được thêm vào giỏ hàng.`);
  return [...items, { ...product, quantity: 1 }];
};

export const changeQuantityLogic = (
  items: OrderedItem[],
  id: string,
  delta: number,
) => {
  toast.success("Số lượng món đã được cập nhật.");
  return items.map((i) =>
    i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
  );
};

export const removeItemLogic = (items: OrderedItem[], id: string) => {
  toast.success("Món đã được xóa khỏi đơn hàng.");
  return items.filter((i) => i.id !== id);
};

export const getTotalPrice = (items: OrderedItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const getTotalQuantity = (items: OrderedItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);
