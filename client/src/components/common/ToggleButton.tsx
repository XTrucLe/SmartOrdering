"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleButtonProps {
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

export const ToggleButton = ({
  options,
  onChange,
  className,
  defaultValue,
}: ToggleButtonProps) => {
  const [active, setActive] = useState(defaultValue ?? options[0]?.value);

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div
      role="group"
      className={cn(
        "flex rounded-md border border-border bg-muted p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = active === option.value;

        return (
          <button
            key={option.value}
            aria-pressed={isActive}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => handleClick(option.value)}
            className={cn(
              "p-2 text-xs font-medium rounded-sm transition-all duration-150 ease-in-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:pointer-events-none",
              isActive
                ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
