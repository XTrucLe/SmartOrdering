"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type DropdownItem = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  separator?: boolean;
};

export function CommonDropdown({
  trigger,
  items,
  align = "end",
  className,
}: {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className={cn("bg-popover text-popover-foreground", className)}
      >
        {items.map((item, i) => {
          if (item.separator) return <DropdownMenuSeparator key={i} />;

          return (
            <DropdownMenuItem
              key={i}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "flex items-center gap-2",
                item.variant === "destructive" && "text-error focus:text-error",
              )}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
