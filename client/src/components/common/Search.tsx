"use client";

import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shortcut?: string;
  className?: string;
};

export function SearchBox({
  value,
  onChange,
  placeholder = "Tìm món...",
  shortcut,
  className,
}: SearchBoxProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        size={18}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 outline-none focus:outline-none focus:ring-0"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value && (
          <button
            onClick={() => onChange("")}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}

        {shortcut && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
            {shortcut}
          </span>
        )}
      </div>
    </div>
  );
}
