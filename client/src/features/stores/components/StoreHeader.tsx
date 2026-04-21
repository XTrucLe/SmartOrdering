"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HEADER_TABS } from "../constants/HeaderTab";
import { cn } from "@/lib/utils";

function StoreHeader() {
  return (
    <div
      className="sticky top-0 z-20 border-b bg-card/60 shadow-xs"
      style={{ width: `${HEADER_TABS.length * 120}px` }}
    >
      <TabsList className={cn("h-10 w-full justify-start bg-transparent p-0")}>
        {HEADER_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative h-full px-3 text-sm font-medium overflow-hidden whitespace-nowrap",
              "text-muted-foreground transition-colors rounded-xs border-none",

              "hover:text-foreground",

              "data-[state=active]:text-foreground data-[state=active]:bg-card/90",

              "after:absolute after:bottom-0 after:left-0",
              "after:h-0.5 after:w-full",
              "after:bg-foreground",

              "after:scale-x-0 after:origin-left",
              "after:transition-transform after:duration-200",
              "data-[state=active]:after:scale-x-100",
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

export default StoreHeader;
