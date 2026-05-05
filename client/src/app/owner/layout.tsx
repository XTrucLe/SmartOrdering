"use client";

import { Sidebar } from "@/components/common/Sidebar";
import {
  Bell,
  ChartColumn,
  Gauge,
  Hamburger,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Store,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  {
    value: "dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} />,
  },

  {
    value: "operations",
    label: "Vận hành",
    icon: <Gauge size={20} />,
    children: [
      {
        value: "orders",
        label: "Đơn hàng",
        icon: <ListChecks size={20} />,
      },
    ],
  },

  {
    value: "areas",
    label: "Khu vực",
    icon: <MapPin size={20} />,
  },

  {
    value: "catalog",
    label: "Danh mục",
    icon: <UtensilsCrossed size={20} />,
    children: [
      {
        value: "products",
        label: "Sản phẩm",
        icon: <UtensilsCrossed size={20} />,
      },
      {
        value: "menu",
        label: "Thực đơn",
        icon: <Hamburger size={20} />,
      },
    ],
  },

  {
    value: "people",
    label: "Nhân sự",
    icon: <User size={20} />,
    children: [
      {
        value: "staff",
        label: "Nhân viên",
        icon: <User size={20} />,
      },
    ],
  },

  {
    value: "store",
    label: "Cửa hàng",
    icon: <Store size={20} />,
  },

  {
    value: "insights",
    label: "Báo cáo & phân tích",
    icon: <ChartColumn size={20} />,
  },
];

function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeId, setActiveId] = useState<string>(() => {
    return pathname.split("/")[2] || "dashboard";
  });

  const handleSelect = (id: string) => {
    setActiveId(id);

    router.push(`/owner/${id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        logo={
          <div className="flex items-center gap-2 py-1">
            <Store size={28} />
            <span className="text-lg font-bold">Smart Ordering</span>
          </div>
        }
        items={sidebarItems}
        activeId={activeId}
        isCollapsed={false}
        onSelect={handleSelect}
        className="shadow-xl h-full sticky top-0"
      />

      <section className="flex flex-1 flex-col min-h-0">
        <header className="sticky top-0 z-40 h-16 border-b flex items-center justify-between px-4 bg-card">
          <div className="text-sm font-medium">Store A</div>

          <div className="flex items-center gap-4">
            <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-xl transition-colors border">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-auto ">{children}</main>
      </section>
    </div>
  );
}

export default OwnerLayout;
