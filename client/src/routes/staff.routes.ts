import { NavItem } from "@/types/navItem";
import { ClipboardList, Clock, UtensilsCrossed, Table } from "lucide-react";

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

  tables: {
    name: "Tables",
    href: "/staff/[store_slug]/tables",
    icon: Table,
  },

  queue: {
    name: "Queue",
    href: "/staff/[store_slug]/queue",
    icon: Clock,
  },
};
