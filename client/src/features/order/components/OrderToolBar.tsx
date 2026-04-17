"use client";

import { cn } from "@/lib/utils";
import { SearchBox } from "@/components/common/Search";
import { Toolbar } from "@/components/common/Toolbar";
import OrderFilter, { FilterValue } from "./OrderFilter";

interface OrderToolBarProps {
  leftChildren?: React.ReactNode;
  filter: FilterValue;
  onFilterChange: (value: FilterValue) => void;
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
}

export const OrderToolBar = ({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  className,
  leftChildren,
}: OrderToolBarProps) => {
  return (
    <Toolbar
      className={cn(className)}
      left={leftChildren}
      center={
        <SearchBox
          placeholder="Filter orders..."
          value={query}
          onChange={onQueryChange}
        />
      }
      right={<OrderFilter value={filter} onChange={onFilterChange} />}
    />
  );
};
