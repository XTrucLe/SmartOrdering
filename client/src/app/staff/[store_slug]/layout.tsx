"use client";

import AppSidebar from "@/components/layouts/AppSidebar";
import StaffHeader from "@/components/layouts/StaffHeader";
import { useQueryState } from "@/hooks/useQueryParam";
import { StaffNavItems } from "@/routes/staff.routes";
import { NavItem } from "@/types/navItem";
import { useParams } from "next/navigation";

export const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  const param = useParams();
  const [query, setQuery] = useQueryState({
    key: "q",
    defaultValue: "",
    prase: (value) => value,
    serialize: (value) => value,
  });

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
    <div className="flex h-screen">
      <AppSidebar items={NavItems} />

      <main className="flex flex-1 flex-col min-h-0">
        <StaffHeader query={query ?? ""} setQuery={setQuery} />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default StaffLayout;
