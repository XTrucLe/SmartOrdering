"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function FilterPopover({
  open,
  setOpen,
  triggerLabel = "Filter",
  activeCount = 0,
  children,
  footer,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLabel?: string;
  activeCount?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          {triggerLabel}

          {activeCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({activeCount})
            </span>
          )}

          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="
          w-72 p-4
          animate-in fade-in zoom-in-95
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out
          data-[state=closed]:zoom-out-95
        "
      >
        <div className="space-y-4">{children}</div>

        {footer && (
          <div className="mt-4 flex items-center justify-between">{footer}</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
