import {
  History,
  LayoutDashboard,
  List,
  LogOut,
  Package,
  Settings,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    value: "dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
    tooltip: "Tổng quan",
  },
  {
    value: "orders",
    label: "Bán hàng",
    icon: List,
    tooltip: "Bán hàng",
  },
  {
    value: "queue",
    label: "Đơn hàng",
    icon: Package,
    tooltip: "Tiến độ",
    badge: 5,
  },
  {
    value: "history",
    label: "Lịch sử",
    icon: History,
    tooltip: "Nhật ký",
  },
];

const SIDEBAR_FOOTER = [
  { value: "settings", label: "Cài đặt", icon: Settings },
  {
    value: "logout",
    label: "Đăng xuất",
    icon: LogOut,
    danger: true,
  },
];

export { SIDEBAR_ITEMS, SIDEBAR_FOOTER };
