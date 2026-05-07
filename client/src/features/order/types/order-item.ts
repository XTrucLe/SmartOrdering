import { SectionItem } from "@/features/menu/types";

export interface SelectedOption {
  groupName: string;
  choiceName: string;
  extraPrice: number;
}

export interface OrderItemPayload {
  item: SectionItem;
  options?: SelectedOption[];
  note?: string;
}

export type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  currency: string;
  unit: string;
  quantity: number;
  options?: SelectedOption[];
  totalPrice: number;
  signature: string;
};
