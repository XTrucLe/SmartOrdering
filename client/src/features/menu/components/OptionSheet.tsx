"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { ItemOptions } from "../types";

type OptionSheetProps = {
  title?: string;
  open: boolean;
  options: ItemOptions[];
  onConfirm: (selected: Record<string, string>) => void;
  onClose: () => void;
};

export const OptionSheet = ({
  title = "Lựa chọn",
  open,
  options,
  onConfirm,
  onClose,
}: OptionSheetProps) => {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;

    const defaults: Record<string, string> = {};

    options.forEach((option) => {
      if (option.groupType === "single" && option.choices?.length) {
        defaults[option.name] = option.choices[0].name;
      }
    });

    setSelected(defaults);

    setErrors({});
  }, [open, options]);

  const missingOptions = useMemo(() => {
    return options.filter(
      (option) => option.required && !selected[option.name],
    );
  }, [options, selected]);

  const extraPrice = useMemo(() => {
    let total = 0;
    options.forEach((option) => {
      const choice = option.choices.find(
        (choice) => choice.name === selected[option.name],
      );

      if (choice) {
        total += parseInt(choice.extraPrice);
      }
    });

    return total;
  }, [options, selected]);

  const handleConfirm = () => {
    if (missingOptions.length) {
      const nextErrors: Record<string, boolean> = {};

      missingOptions.forEach((option) => {
        nextErrors[option.name] = true;
      });

      setErrors(nextErrors);

      return;
    }

    onConfirm(selected);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-108 sm:max-h-[70vh] h-full overflow-hidden pb-4 shadow-inner"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 min-h-0 overflow-y-auto py-4 no-scrollbar">
          {options.map((option) => {
            const hasError = errors[option.name];

            return (
              <div key={option.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{option.name}</p>

                  {option.required && (
                    <span className="text-[11px] text-muted-foreground">
                      Bắt buộc
                    </span>
                  )}
                </div>

                <RadioGroup
                  value={selected[option.name]}
                  onValueChange={(value) => {
                    setSelected((prev) => ({
                      ...prev,

                      [option.name]: value,
                    }));

                    setErrors((prev) => ({
                      ...prev,

                      [option.name]: false,
                    }));
                  }}
                  className="flex flex-col gap-2"
                >
                  {option.choices.map((choice) => {
                    const active = selected[option.name] === choice.name;

                    const inputId = `${option.name}-${choice.name}`;

                    return (
                      <Label
                        key={inputId}
                        htmlFor={inputId}
                        className={cn(
                          "relative flex h-11 cursor-pointer items-center justify-between rounded-xl border px-4 text-sm",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:bg-accent",
                          hasError && "border-destructive",
                        )}
                      >
                        <RadioGroupItem
                          value={choice.name}
                          id={inputId}
                          className="absolute opacity-0 pointer-events-none"
                        />

                        <span>{choice.name}</span>

                        {!!choice.extraPrice && (
                          <span className="text-xs opacity-70">
                            +{formatCurrency(choice.extraPrice, "VND")}
                          </span>
                        )}
                      </Label>
                    );
                  })}
                </RadioGroup>

                {hasError && (
                  <p className="text-xs text-destructive">
                    Vui lòng chọn {option.name.toLowerCase()}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center px-2 pt-2 mt-auto border-t">
          <span className="text-sm">
            <b>Phụ thu</b>: {formatCurrency(extraPrice, "VND")}
          </span>
          <Button onClick={handleConfirm} className="min-w-28">
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
