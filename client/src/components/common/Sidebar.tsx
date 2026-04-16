"use client";

import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemData {
  value: string;
  label: string;
  icon: React.ReactNode;
  tooltip?: string;
  badge?: number | string;
  danger?: boolean;
}

interface SidebarProps {
  logo?: React.ReactNode;
  items: SidebarItemData[];
  activeId: string;
  onSelect: (id: string) => void;
  isCollapsed?: boolean;
  footer?: SidebarItemData[];
  className?: string;
}

export const Sidebar = memo(
  ({
    logo,
    items,
    activeId,
    onSelect,
    isCollapsed = false,
    footer,
    className,
  }: SidebarProps) => {
    const activeIndex = items.findIndex((item) => item.value === activeId);

    const indicatorTop = useMemo(() => {
      const ITEM_HEIGHT = 44;
      const GAP = 4;
      const NAV_PADDING_TOP = 16;

      if (activeIndex !== -1) {
        return NAV_PADDING_TOP + activeIndex * (ITEM_HEIGHT + GAP);
      }

      return 0;
    }, [activeIndex]);

    return (
      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "flex flex-col h-full bg-card/40 border-r transition-[width] duration-200",
            isCollapsed ? "w-20" : "w-64",
            className,
          )}
        >
          {logo && (
            <div
              className={cn(
                "h-16 flex items-center border-b px-6",
                isCollapsed ? "justify-center px-0" : "justify-start",
              )}
            >
              {logo}
            </div>
          )}

          <div className="relative flex-1 flex flex-col overflow-hidden">
            <AnimatePresence>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
                {items.map((item) => (
                  <SidebarItem
                    key={item.value}
                    item={item}
                    isActive={item.value === activeId}
                    isCollapsed={isCollapsed}
                    onClick={() => onSelect(item.value)}
                  />
                ))}

                {activeIndex !== -1 && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 bg-primary rounded-r-full z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, top: indicatorTop, height: 44 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </nav>
            </AnimatePresence>

            {footer && (
              <div className="p-3 border-t space-y-1">
                {footer.map((item) => (
                  <SidebarItem
                    key={item.value}
                    item={item}
                    isActive={item.value === activeId}
                    isCollapsed={isCollapsed}
                    onClick={() => onSelect(item.value)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      </TooltipProvider>
    );
  },
);

const SidebarItem = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: SidebarItemData;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) => {
  const { icon, label, tooltip, badge, danger } = item;

  const content = (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "group relative flex items-center h-11 rounded-lg cursor-pointer select-none transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isCollapsed ? "justify-center px-0" : "px-2 gap-3",
      )}
    >
      <div className="flex items-center justify-center shrink-0">{icon}</div>

      {!isCollapsed && (
        <span
          className={cn(
            "truncate tracking-tight",
            danger && "text-destructive",
          )}
        >
          {label}
        </span>
      )}

      {badge !== undefined && !isCollapsed && (
        <span className="ml-auto bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </div>
  );

  if (isCollapsed || tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={10}
          className="font-bold border-border"
        >
          {tooltip || label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

Sidebar.displayName = "Sidebar";
SidebarItem.displayName = "SidebarItem";
