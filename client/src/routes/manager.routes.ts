import { NavItem } from "@/types/navItem";
import {
  LayoutDashboard,
  ClipboardList,
  Menu,
  Table,
  Clock,
  BarChart3,
} from "lucide-react";

export const ManagerNavItems: Record<string, NavItem> = {
  dashboard: {
    name: "Dashboard",
    href: "/manager/[store_slug]",
    icon: LayoutDashboard,
  },
  orders: {
    name: "Orders",
    href: "/manager/[store_slug]/orders",
    icon: ClipboardList,
  },
  menu: {
    name: "Menu",
    href: "/manager/[store_slug]/menu",
    icon: Menu,
  },
  tables: {
    name: "Tables",
    href: "/manager/[store_slug]/tables",
    icon: Table,
  },
  queue: {
    name: "Queue",
    href: "/manager/[store_slug]/queue",
    icon: Clock,
  },
  reports: {
    name: "Reports",
    href: "/manager/[store_slug]/reports",
    icon: BarChart3,
  },
};
