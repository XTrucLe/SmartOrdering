"use client";

import { cn } from "@/lib/utils";
import { TABLE_STATUS_STYLE, TableStatusMap } from "../constants/table";
import { Table } from "../types";
import { Users } from "lucide-react";

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
        "relative flex flex-col items-center justify-center min-h-22.5 rounded-xl border transition-all",
        style.bg,
        style.text,
        style.border,
        selected
          ? "ring-offset-1 ring-1 ring-primary border-transparent"
          : "hover:border-primary/50",
      )}
    >
      <div className="absolute top-3 right-3">
        <span className={cn("block h-2.5 w-2.5 rounded-full", style.dotbg)} />
      </div>

      <h4 className="font-medium uppercase">{table.name}</h4>

      <div className="flex flex-col items-center mt-1">
        <span className="text-[10px] font-semibold opacity-80 tracking-widest uppercase">
          {TableStatusMap[table.status]}
        </span>

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
          <Users size={12} className="opacity-70" />
          <span className="text-xs font-semibold">{table.capacity}</span>
        </div>
      </div>
    </button>
  );
}
