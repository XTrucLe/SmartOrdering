"use client";

import { cn } from "@/lib/utils";
import { TABLE_STATUS_STYLE, TableStatusMap } from "../constants/table";
import { Table } from "../types";

type TableNodeProps = {
  table: Table;
  onClick: (table: Table) => void;
  selected?: boolean;
};

export default function TableNode({
  table,
  onClick,
  selected,
}: TableNodeProps) {
  const style = TABLE_STATUS_STYLE[table.status];

  return (
    <button
      type="button"
      onClick={() => onClick(table)}
      className={cn(
        "relative flex flex-col items-center w-full rounded-md border p-4 transition-all max-w-xs",
        style.bg,
        style.text,
        style.border,
        "hover:shadow-md",
        selected && "ring-2 ring-primary",
      )}
    >
      <span
        className={cn(
          "absolute top-3 right-3 h-3 w-3 rounded-full",
          style.border.replace("border", "bg"),
        )}
      />

      <h4 className="font-medium">{table.name}</h4>

      <p className="text-xs opacity-80">{TableStatusMap[table.status]}</p>
    </button>
  );
}
