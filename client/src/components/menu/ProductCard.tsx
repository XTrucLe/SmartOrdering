"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, ImageOff, Loader2 } from "lucide-react";
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
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden bg-card shadow-sm transition-all duration-300 hover:shadow-md flex flex-col h-full active:scale-[0.98]">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {item.imageUrl ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
              </div>
            )}

            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className={cn(
                "object-cover transition-all duration-500 will-change-transform",
                "group-hover:scale-110 no-select",
                isImageLoading ? "scale-110 blur-lg" : "scale-100 blur-0",
              )}
              sizes="(max-width: 768px) 50vw, 33vw"
              onLoad={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-[10px] uppercase font-medium tracking-wider">
              No Image
            </span>
          </div>
        )}
      </div>

      <CardContent className="px-3 flex-1 flex flex-col gap-1.5">
        <h3 className="font-bold text-md md:text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0 pb-4 mt-auto flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Giá bán
          </span>

          <span className="inline-flex items-baseline gap-1 font-bold text-md md:text-lg text-primary leading-none">
            {formatPrice(item.price)}
            <span className="text-[11px] font-normal text-muted-foreground">
              /{item.unit}
            </span>
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-primary shadow-sm hover:shadow-md hover:bg-primary/90 transition-all duration-300 active:scale-90"
              onClick={(e) => {
                e.preventDefault();
                if (onClick) {
                  onClick(item);
                }
              }}
            >
              <Plus
                className="w-5 h-5 text-primary-foreground"
                strokeWidth={3}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">Thêm vào giỏ hàng</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
