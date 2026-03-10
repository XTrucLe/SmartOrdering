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

export default function AppSidebar({
  items,
}: {
  items: Record<string, NavItem>;
}) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      className={`
        border-r bg-background select-none
        transition-all duration-300
      `}
      collapsible="icon"
    >
      <SidebarHeader className="relative flex items-center gap-3 px-4 py-4 border-b">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10">
          <Image
            src="/pos-logo.png"
            alt="POS"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>

        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">POS System</span>
            <span className="text-xs text-muted-foreground">Staff Panel</span>
          </div>
        )}

        <div className="absolute -right-7.5 top-0 bg-sidebar border border-l-transparent">
          <SidebarTrigger onClick={toggleSidebar} />
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
