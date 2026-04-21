"use client";

import { Search, X, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SearchBoxProps = {
  value?: string;
  onChange?: (value: string) => void;
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
    <div className={cn("group relative w-full max-w-sm", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Search
          size={16}
          strokeWidth={2}
          className="text-muted-foreground group-focus-within:text-foreground transition-colors duration-200"
        />
      </div>

      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 pl-10 pr-12 text-sm",
          "bg-muted/50 border-input transition-all duration-200",
          "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:bg-background focus-visible:border-ring/50",
          "rounded-md",
        )}
      />

      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange?.("")}
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X size={14} strokeWidth={2.5} />
          </Button>
        ) : (
          shortcut && (
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 mr-1">
              <span className="text-xs">⌘</span>
              {shortcut}
            </kbd>
          )
        )}
      </div>
    </div>
  );
}
