export type OrderItem = {
  id: string;
  orderId?: string;
  itemId?: string;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
};
