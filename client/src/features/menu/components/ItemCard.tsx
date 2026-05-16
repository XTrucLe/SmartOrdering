"use client";

import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { useState, useCallback } from "react";
import { SectionItem } from "../types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { OptionSheet } from "./OptionSheet";
import { OrderItemPayload } from "@/features/order/types";

interface ItemCardProps {
  item: SectionItem;
  onAdd: (payload: OrderItemPayload) => void;
  isAvailable?: boolean;
}

export default function ItemCard({
  item,
  onAdd,
  isAvailable = true,
}: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const handleAdd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!isAvailable) return;

      if (item.options?.length) {
        setOpenOptions(true);
        return;
      }
      onAdd({
        item,
        options: [],
      });
    },
    [isAvailable, item, onAdd],
  );

  const showImageFallback = !item.imageUrl || imageError;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden bg-card",
        "border border-border/60",
        "transition-all duration-200 ease-out shadow-lg",
        isAvailable
          ? "active:scale-[0.97] active:border-primary/40"
          : "opacity-60 cursor-not-allowed",
      )}
    >
      <div className="relative w-full aspect-4/3 bg-muted overflow-hidden">
        {!showImageFallback ? (
          <Image
            src={item.imageUrl!}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              isAvailable && "group-hover:scale-105",
            )}
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/60">
            <ImageOff className="h-7 w-7 text-muted-foreground/30" />
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-foreground/70 bg-background/80 px-2.5 py-1 rounded-full border border-border/60">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-2.5 gap-2">
        <p className="text-[13px] font-medium leading-snug line-clamp-2 text-foreground min-h-9">
          {item.name}
        </p>

        <div className="flex items-center justify-between gap-1 mt-auto">
          <span className="text-[13px] font-bold text-primary tracking-tight">
            {formatCurrency(item.price, item.currency || "VND")}
          </span>

          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            aria-label={`Thêm ${item.name} vào giỏ`}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full",
              "transition-all duration-150 active:scale-90",
              isAvailable
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {item.options?.length ? (
        <OptionSheet
          title={item.name}
          options={item.options}
          open={openOptions}
          onClose={() => setOpenOptions(false)}
          onConfirm={(selected) => {
            const normalizedOptions =
              item.options?.map((group) => {
                const selectedName = selected[group.name];
                const choice = group.choices.find(
                  (c) => c.name === selectedName,
                );

                return {
                  groupName: group.name,
                  optionName: choice?.name ?? "",
                  extraPrice: Number(choice?.extraPrice ?? 0),
                };
              }) ?? [];

            onAdd({
              item,
              options: normalizedOptions,
            });

            setOpenOptions(false);
          }}
        />
      ) : null}
    </div>
  );
}
