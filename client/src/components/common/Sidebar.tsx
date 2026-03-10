"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, Command } from "lucide-react"; // Đổi sang ChevronRight để xoay mượt hơn

export type ItemsSidebar = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  sub_items?: ItemsSidebar[];
};

export function SidebarCustom({ items = [] }: { items?: ItemsSidebar[] }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Staff Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                const isOpen =
                  openMenus[item.label] || (item.sub_items && isActive);

                return (
                  <SidebarMenuItem key={item.label} className="text-md">
                    {item.sub_items ? (
                      /* PARENT ITEM WITH SUBMENU */
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.label)}
                        tooltip={item.label}
                        isActive={isActive}
                        className="group/collapsible w-full justify-between"
                      >
                        {/* Wrapper để icon và text nằm bên trái */}
                        <div className="flex items-center gap-2">
                          {item.icon && (
                            <span className="size-4">{item.icon}</span>
                          )}
                          <span className="font-medium">{item.label}</span>
                        </div>

                        {/* Chevron Animation: Xoay 90 độ khi mở */}
                        <ChevronRight
                          className={cn(
                            "ml-auto size-4 transition-transform duration-200 text-muted-foreground",
                            isOpen && "rotate-90 text-foreground",
                          )}
                        />
                      </SidebarMenuButton>
                    ) : (
                      /* SINGLE ITEM */
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={item.href} className="font-medium">
                          {item.icon && (
                            <span className="size-4">{item.icon}</span>
                          )}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}

                    {/* SUB ITEMS */}
                    {item.sub_items && isOpen && (
                      <SidebarMenuSub>
                        {item.sub_items.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <SidebarMenuSubItem key={sub.label}>
                              <SidebarMenuButton
                                asChild
                                isActive={isSubActive}
                                size="sm" // Sub item nhỏ hơn một chút
                              >
                                <Link href={sub.href}>
                                  {sub.icon && (
                                    <span className="size-4 opacity-70">
                                      {sub.icon}
                                    </span>
                                  )}
                                  <span
                                    className={cn(
                                      // Nếu không active thì màu nhạt hơn để tạo phân cấp
                                      !isSubActive && "text-muted-foreground",
                                    )}
                                  >
                                    {sub.label}
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
