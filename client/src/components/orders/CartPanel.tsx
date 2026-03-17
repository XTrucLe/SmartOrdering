"use client";

import { useCartStore } from "@/stores/cart.store";
import OrderPanel from "@/components/orders/OrderPanel";

export default function CartPanel({ onConfirm }: { onConfirm: () => void }) {
  const { items, changeQuantity, removeItem, totalPrice } = useCartStore();

  const total = totalPrice();

  return (
    <OrderPanel
      items={items}
      total={total}
      disabled={items.length === 0}
      onIncrease={(id) => changeQuantity(id, 1)}
      onDecrease={(id) => changeQuantity(id, -1)}
      onRemove={removeItem}
      onConfirm={onConfirm}
    />
  );
}
