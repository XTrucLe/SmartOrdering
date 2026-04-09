"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, ImageOff, Loader2, Flame } from "lucide-react";
import { Item } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ItemCardProps {
  item: Item;
  onClick?: (item: Item) => void;
  isHot?: boolean;
  isAvailable?: boolean;
}

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function ItemCard({
  item,
  onClick,
  isHot = false,
  isAvailable = true,
}: ItemCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const formattedPrice = useMemo(
    () => priceFormatter.format(item.price),
    [item.price],
  );

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden bg-card transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]",
        !isAvailable && "opacity-60 grayscale",
      )}
    >
      {isHot && isAvailable && (
        <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
          <Flame className="h-3 w-3 fill-current" />
          HOT
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {item.imageUrl ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              </div>
            )}
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700 will-change-transform",
                "group-hover:scale-110",
                isImageLoading ? "blur-md" : "blur-0",
              )}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoad={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-300">
            <ImageOff className="mb-2 h-8 w-8 opacity-50" />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              No Image
            </span>
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-md border-2 border-white px-3 py-1 text-sm font-black uppercase tracking-widest text-white">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 px-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-base">
          {item.name}
        </h3>

        {item.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex items-end justify-between p-4 pt-0 ">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Giá bán
          </span>
          <div className="flex items-baseline gap-1 font-black text-primary">
            <span className="text-base md:text-lg">{formattedPrice}</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              /{item.unit || "phần"}
            </span>
          </div>
        </div>

        <div className="z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                disabled={!isAvailable}
                className={cn(
                  "h-9 w-9 rounded-full shadow-lg transition-all duration-300",
                  "hover:scale-110 active:scale-95",
                  isAvailable
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onClick && isAvailable) onClick(item);
                }}
              >
                <Plus className="h-6 w-6" strokeWidth={4} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isAvailable ? "Thêm vào giỏ" : "Tạm hết món"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
