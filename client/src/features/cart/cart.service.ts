import { toast } from "sonner";
import { CartItemPayload, SelectedOption, CartItem } from "./types";
import { OrderService } from "@/lib/api";
import { CreateOrderRequest } from "../order/types";
import { useCartStore } from "./cart.store";

const NAME_REGEX = /^[\p{L}\s]+$/u;
const PHONE_REGEX = /^(0|\+84)([3|5|7|8|9])[0-9]{8}$/;

export const createOptionSignature = (options: SelectedOption[] = []) => {
  return options
    .filter((o) => o.optionName?.trim())
    .map((o) => `${o.groupName}:${o.optionName}`)
    .sort()
    .join("|");
};

export const addItemLogic = (
  items: CartItem[],
  payload: CartItemPayload,
): CartItem[] => {
  const { item, options = [] } = payload;
  const signature = createOptionSignature(options);

  const existingIndex = items.findIndex(
    (i) => i.itemId === item.itemId && i.signature === signature,
  );

  if (existingIndex > -1) {
    return items.map((i, index) => {
      if (index !== existingIndex) return i;
      const newQuantity = i.quantity + 1;
      return {
        ...i,
        quantity: newQuantity,
        totalPrice: i.unitPrice * newQuantity,
      };
    });
  }

  const optionsPrice = options.reduce(
    (sum, opt) => sum + (opt.extraPrice || 0),
    0,
  );
  const unitPrice = optionsPrice + Number(item.price);

  return [
    ...items,
    {
      itemId: item.itemId,
      name: item.name,
      imageUrl: item.imageUrl,
      quantity: 1,
      unit: item.unit,
      unitPrice: unitPrice,
      totalPrice: unitPrice,
      currency: item.currency,
      options: options.filter((o) => o.optionName),
      signature,
    },
  ];
};

export const validateCustomerInfo = (
  name: string | null,
  phone: string | null,
): boolean => {
  if (name && !NAME_REGEX.test(name.trim())) {
    toast.error("Tên khách hàng không hợp lệ.");
    return false;
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    toast.error("Số điện thoại khách hàng không hợp lệ.");
    return false;
  }
  return true;
};

export const removeItem = (
  items: CartItem[],
  removeId: string,
  signature: string,
) => {
  return items.filter(
    (item) => !(item.itemId === removeId && item.signature === signature),
  );
};

export const changeQuantity = (
  items: CartItem[],
  signature: string,
  delta: number,
) => {
  return items.map((item) => {
    if (item.signature !== signature) return item;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return item;
    return {
      ...item,
      quantity: newQuantity,
      totalPrice: item.unitPrice * newQuantity,
    };
  });
};

let syncTimeout: NodeJS.Timeout | null = null;
let abortController: AbortController | null = null;

export const debouncedSync = (
  data: Partial<CreateOrderRequest>,
  orderId: string,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {
    try {
      await syncOrder(data, orderId);
      onSuccess?.();
    } catch (error) {
      onError?.();
    }
  }, 3000);
};

export const syncOrder = async (
  data: Partial<CreateOrderRequest>,
  orderId: string,
) => {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    if (data.customerName || data.customerPhone) {
      const isValid = validateCustomerInfo(
        data.customerName || null,
        data.customerPhone || null,
      );
      if (!isValid) throw new Error("Invalid customer info");
    }

    const response = await OrderService.updateBill(orderId, data, {
      signal: abortController.signal,
    });

    return response;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      throw error;
    }
  }
};

export const forceSyncNow = async (
  data: Partial<CreateOrderRequest>,
  orderId: string,
) => {
  if (syncTimeout) clearTimeout(syncTimeout);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/draft/${orderId}`;
  const body = JSON.stringify(data);

  fetch(url, {
    method: "PUT",
    keepalive: true,
    headers: { "Content-Type": "application/json", withCredentials: "include" },
    body,
  });
};

export const handleConfirmOrder = async () => {
  const state = useCartStore.getState();

  const { items, customer, method, orderId } = state;

  if (items.length === 0) return false;

  const isValid = validateCustomerInfo(
    customer?.name || null,
    customer?.phoneNumber || null,
  );

  console.log(customer);

  if (!isValid) return false;

  try {
    const orderData: CreateOrderRequest = {
      items: items.map(({ itemId, quantity, options }) => ({
        itemId,
        quantity,
        options,
      })),
      deliveryMethod: method,
      customerName: customer?.name,
      customerPhone: customer?.phoneNumber,
    };

    console.log(method);

    await syncOrder(orderData, orderId!);

    const response = await OrderService.confirmOrder(orderId!);

    if (response) {
      toast.success("Đơn hàng đã được xác nhận!");
      return true;
    }
    return false;
  } catch (error) {
    toast.error("Có lỗi xảy ra khi xác nhận đơn hàng.");
    return false;
  }
};
