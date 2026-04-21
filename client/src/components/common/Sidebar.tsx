"use client";

import React, { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface SidebarItemData {
  value: string;
  label: string;
  icon: React.ReactNode;
  tooltip?: string;
  badge?: number | string;
  danger?: boolean;
  children?: SidebarItemData[];
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
    return (
      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "flex flex-col h-full bg-card/40 border-r transition-[width] duration-300",
            isCollapsed ? "w-20" : "w-64",
            className,
          )}
        >
          {logo && (
            <div
              className={cn(
                "container h-16 flex items-center border-b px-6",
                isCollapsed ? "justify-center px-0" : "justify-start",
              )}
            >
              {logo}
            </div>
          )}

          <div className="relative flex-1 flex flex-col overflow-hidden w-full">
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
              {items.map((item) => (
                <SidebarItem
                  key={item.value}
                  item={item}
                  activeId={activeId}
                  isCollapsed={isCollapsed}
                  onClick={onSelect}
                />
              ))}
            </nav>

            {footer && (
              <div className="p-3 border-t space-y-1">
                {footer.map((item) => (
                  <SidebarItem
                    key={item.value}
                    item={item}
                    activeId={activeId}
                    isCollapsed={isCollapsed}
                    onClick={onSelect}
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
  activeId,
  isCollapsed,
  onClick,
  isChild = false,
}: {
  item: SidebarItemData;
  activeId: string;
  isCollapsed: boolean;
  onClick: (v: string) => void;
  isChild?: boolean;
}) => {
  const { icon, label, tooltip, danger, children, value } = item;

  const [open, setOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const hasChildren = !!children?.length;

  const isActive = activeId.includes(value);

  useEffect(() => {
    if (!isActive) setOpen(false);
  }, [isActive]);

  const handleToggle = () => {
    if (hasChildren && !isCollapsed) setOpen((v) => !v);
    !isActive &&
      onClick(`${value}${hasChildren ? `/${children[0].value}` : ""}`);
  };

  const baseItem = (
    <div
      role="button"
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center h-10 rounded-md cursor-pointer select-none transition-all duration-200",
        isCollapsed ? "justify-center px-0" : "px-3 gap-3",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        isChild && !isCollapsed && "h-9 text-sm pl-2",
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className={cn(
            "absolute -left-2.5 top-0  w-1 rounded-full bg-primary",
            isChild ? "h-9" : "h-10",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}

      <div className="flex items-center justify-center shrink-0 w-5">
        {icon}
      </div>

      {!isCollapsed && (
        <span className={cn("truncate", danger && "text-destructive")}>
          {label}
        </span>
      )}

      {!isCollapsed && hasChildren && (
        <ChevronDown
          size={14}
          className={cn(
            "ml-auto transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      )}
    </div>
  );

  const tooltipWrap = (node: React.ReactNode) => {
    if (!isCollapsed && !tooltip) return node;

    if (isCollapsed && hasChildren) {
      return (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>{node}</PopoverTrigger>
          <PopoverContent
            side="right"
            sideOffset={10}
            align="start"
            className="w-48"
          >
            <div className="flex flex-col">
              {children?.map((child) => (
                <div
                  key={child.value}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted cursor-pointer",
                    activeId.endsWith(child.value) &&
                      "bg-primary/10 text-primary font-medium",
                  )}
                  onClick={() => {
                    onClick(`${value}/${child.value}`);
                    setShowPopover(false);
                  }}
                >
                  {child?.icon}
                  <span className="truncate">{child.label}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {tooltip || label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="w-full">
      {tooltipWrap(baseItem)}

      <AnimatePresence initial={false}>
        {hasChildren && open && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-2 pl-2 border-l border-muted-foreground/50 space-y-1">
              {children.map((child) => (
                <SidebarItem
                  key={child.value}
                  item={child}
                  activeId={activeId}
                  isCollapsed={isCollapsed}
                  onClick={(childPath) => onClick(`${value}/${childPath}`)}
                  isChild={true}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
