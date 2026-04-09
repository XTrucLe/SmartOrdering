import { Item, OrderedItem } from "@/types";

export const addItemLogic = (items: OrderedItem[], product: Item) => {
  const existing = items.find((i) => i.id === product.id);

  if (existing) {
    return items.map((i) => (i.id === product.id ? { ...i, quantity: 1 } : i));
  }

  return [...items, { ...product, quantity: 1 }];
};

export const changeQuantityLogic = (
  items: OrderedItem[],
  id: string,
  delta: number,
) =>
  items.map((i) =>
    i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
  );

export const removeItemLogic = (items: OrderedItem[], id: string) =>
  items.filter((i) => i.id !== id);

export const getTotalPrice = (items: OrderedItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const getTotalQuantity = (items: OrderedItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);
