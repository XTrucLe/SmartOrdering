import { DeliveryType } from "@/features/order/constants/order.constant";

export const DeliveryTypeRenders: {
  value: DeliveryType;
  icon: string;
  label: string;
}[] = [
  {
    value: "DINE_IN",
    icon: "tabler:table",
    label: "Tại bàn",
  },
  {
    value: "TAKEAWAY",
    icon: "tabler:bag",
    label: "Mang đi",
  },
  {
    value: "DELIVERY",
    icon: "tabler:truck-delivery",
    label: "Giao hàng",
  },
];
