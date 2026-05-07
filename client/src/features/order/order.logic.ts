import { toast } from "sonner";
import { OrderItemPayload, SelectedOption } from "./types";
import { OrderItem } from "./types";

export const createOptionSignature = (options: SelectedOption[] = []) => {
  return options
    .map((o) => `${o.groupName}:${o.choiceName}`)
    .sort()
    .join("|");
};

export const addItemLogic = (items: OrderItem[], payload: OrderItemPayload) => {
  const { item, options = [] } = payload;

  const signature = createOptionSignature(options);

  const existing = items.find(
    (i) => i.itemId === item.id && i.signature === signature,
  );

  if (existing) {
    toast.success("Đã tăng số lượng món.");

    return items.map((i) => {
      if (i.signature !== existing.signature) return i;

      const quantity = i.quantity + 1;

      return {
        ...i,
        quantity,
        totalPrice: Number(item.price) * quantity,
      };
    });
  }

  const optionsPrice = options.reduce(
    (sum, option) => sum + option.extraPrice,
    0,
  );

  const unitPrice = optionsPrice + Number(item.price);

  const orderItem: OrderItem = {
    itemId: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    quantity: 1,
    unit: item.unit,
    price: unitPrice,
    totalPrice: unitPrice,
    currency: item.currency,
    options,
    signature,
  };

  toast.success(`${item.name} đã được thêm vào giỏ hàng.`);

  return [...items, orderItem];
};

export const changeQuantityLogic = (
  items: OrderItem[],
  signature: string,
  delta: number,
) => {
  let updated = false;

  const nextItems = items.map((item) => {
    if (item.signature !== signature) return item;

    const quantity = Math.max(1, item.quantity + delta);

    updated = quantity !== item.quantity;

    return {
      ...item,
      quantity,
      totalPrice: item.price * quantity,
    };
  });

  if (updated) {
    toast.success("Số lượng món đã được cập nhật.");
  } else {
    toast.error("Số lượng món không thể nhỏ hơn 1.");
  }

  return nextItems;
};

export const removeItemLogic = (items: OrderItem[], signature: string) => {
  toast.success("Món đã được xóa khỏi đơn hàng.");

  return items.filter((i) => i.signature !== signature);
};

export const getTotalPrice = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.totalPrice, 0);

export const getTotalQuantity = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);
