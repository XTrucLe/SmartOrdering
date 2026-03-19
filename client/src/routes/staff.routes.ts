import { NavItem } from "@/types/navItem";
import { ClipboardList, UtensilsCrossed } from "lucide-react";

export const StaffNavItems: Record<string, NavItem> = {
  order: {
    name: "New Order",
    href: "/staff/[store_slug]/order",
    icon: UtensilsCrossed,
  },

  orders: {
    name: "Orders",
    href: "/staff/[store_slug]/orders",
    icon: ClipboardList,
  },
};
