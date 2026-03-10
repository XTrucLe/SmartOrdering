"use client";

import AppSidebar from "@/components/layouts/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StaffNavItems } from "@/routes/staff.routes";
import { NavItem } from "@/types/navItem";
import { useParams } from "next/navigation";

export const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  const param = useParams();
  const store_slug = param.store_slug as string;

  const NavItems: Record<string, NavItem> = Object.fromEntries(
    Object.entries(StaffNavItems).map(([key, item]) => [
      key,
      {
        ...item,
        href: item.href.replace("[store_slug]", store_slug),
      },
    ]),
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar items={NavItems} />

        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default StaffLayout;
