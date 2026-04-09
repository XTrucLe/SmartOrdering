"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ControlItemProps {
  value: string;
  label?: string;
  children?: React.ReactNode;
}

interface SegmentControlProps {
  options: ControlItemProps[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SegmentControl({
  options,
  defaultValue,
  className,
  onChange,
}: SegmentControlProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value);
  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Tabs
      defaultValue={defaultValue ?? options[0]?.value}
      className={cn("border-b-2 mx-1", className)}
      onValueChange={handleChange}
    >
      <TabsList className="relative bg-transparent rounded-none gap-2">
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className=" flex-1 text-center min-w-0
                    text-sm font-medium
                    text-muted-foreground
                    data-[state=active]:text-foreground
                    data-[state=active]:font-semibold

                    data-[state=active]:bg-transparent
                    data-[state=active]:shadow-none
                    data-[state=active]:ring-0
                    "
          >
            {option.label || option.value}
          </TabsTrigger>
        ))}
        <div
          className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 rounded-md"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${options.findIndex((o) => o.value === value) * 100}%)`,
          }}
        />
      </TabsList>

      {options
        .filter((option) => option.children)
        .map((option) => (
          <TabsContent
            key={option.value}
            value={option.value}
            className="p-1 px-2"
          >
            {option.children}
          </TabsContent>
        ))}
    </Tabs>
  );
}
