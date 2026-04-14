"use client";

import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formats";

interface ItemCardProps {
  item: Item;
  onAdd: (item: Item) => void;
  isAvailable?: boolean;
}

export default function ItemCard({
  item,
  onAdd,
  isAvailable = true,
}: ItemCardProps) {
  const handleAdd = () => {
    if (!isAvailable) return;
    onAdd(item);
  };

  return (
    <div
      onClick={handleAdd}
      className={cn(
        "group cursor-pointer rounded-lg border bg-card overflow-hidden",
        "active:scale-[0.97]",
        !isAvailable && "opacity-50 grayscale cursor-not-allowed",
      )}
    >
      <div className="relative w-full aspect-4/3 bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-6 w-6 opacity-50" />
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
            Hết hàng
          </div>
        )}
      </div>

      <div className="p-2 space-y-1">
        <div className="text-md font-medium h-10.5 leading-tight line-clamp-2">
          {item.name}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary pl-1">
            {formatCurrency(item.price)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className={cn(
              "flex items-center justify-center rounded-full w-7 h-7",
              "bg-primary text-white",
              "active:scale-90",
              !isAvailable && "bg-muted text-muted-foreground",
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
