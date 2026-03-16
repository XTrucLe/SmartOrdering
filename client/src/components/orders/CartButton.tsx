"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  quantity?: number;
  className?: string;
}

export function CartButton({
  quantity = 0,
  className,
  ...props
}: CartButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className={cn("relative hover:bg-slate-100 self-center", className)}
      {...props}
    >
      <ShoppingCart size={16} className="text-slate-700 size-6" />

      {quantity > 0 && (
        <span className="absolute top-1 -right-px flex h-5 w-5 duration-300 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm animate-bounce">
          {quantity > 99 ? "99+" : quantity}
        </span>
      )}
      <span className="sr-only">Giỏ hàng ({quantity} món)</span>
    </Button>
  );
}
