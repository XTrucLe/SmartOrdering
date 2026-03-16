"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavItem } from "@/types/navItem";
import Image from "next/image";
import { useUIStore } from "@/stores/ui.store";

export default function AppSidebar({
  items,
}: {
  items: Record<string, NavItem>;
}) {
  const pathname = usePathname();
  const { state, toggleSidebar, } = useSidebar();
  const setCollapsed = useUIStore((s) => s.toggleCollapsed);

  const collapsed = state === "collapsed";

  const handleToggle = () => {
    toggleSidebar();
    setCollapsed();
  };

  return (
    <Sidebar
      className={`
        border-r bg-background select-none
        transition-all duration-300
      `}
      collapsible="icon"
    >
      <SidebarHeader className="relative flex h-16 items-center border-b px-3 transition-all duration-300 overflow-visible">
        <div className="flex items-center w-full gap-3">
          <div
            className={`flex items-center justify-center transition-all duration-300 ${collapsed ? "w-full" : "w-9"}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Image
                src="/pos-logo.png"
                alt="POS"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
          </div>

          {!collapsed && (
            <div className="flex flex-col overflow-hidden leading-tight transition-all">
              <span className="text-sm font-bold truncate text-foreground">
                POS System
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                Staff Panel
              </span>
            </div>
          )}
        </div>

        <div
          className={`
            absolute  z-50 transition-all duration-300
            ${collapsed ? "-right-3.5 -bottom-3" : "right-2 top-1/2 -translate-y-1/2"}
          `}
        >
          <SidebarTrigger
            onClick={handleToggle}
            className={`
              h-7 w-7 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground
              ${collapsed ? "flex" : "flex"} 
            `}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {Object.entries(items).map(([key, item]) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="
                    group flex items-center
                    rounded-md
                    px-3 py-2.5
                    text-sm font-medium
                    transition-colors
                    hover:bg-muted
                    data-[active=true]:bg-primary/10
                    data-[active=true]:text-primary
                  "
                >
                  <Link
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center w-full ${
                      collapsed ? "justify-center" : "gap-3"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className="
                          h-5 w-5
                          text-muted-foreground
                          group-data-[active=true]:text-primary
                        "
                      />
                    )}

                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
