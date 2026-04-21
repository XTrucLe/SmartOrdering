"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EditableFieldProps {
  label?: string;
  value: string;
  editable?: boolean;
  onChange: (newValue: string) => void;
}

export function EditableField({
  label,
  value,
  editable = false,
  onChange,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(editable);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm">{label}</Label>}
      {isEditing ? (
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
          className={cn(
            "text-md",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:bg-background focus-visible:border-ring/50",
          )}
        />
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          {value}
        </div>
      )}
    </div>
  );
}
