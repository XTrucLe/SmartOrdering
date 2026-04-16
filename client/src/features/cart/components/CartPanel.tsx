"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "../types";

interface Props {
  items: CartItem[];
  total: number;
  disabled: boolean;

  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;

  onConfirm: () => void;
}

export function OrderPanel({
  items,
  total,
  disabled,
  onIncrease,
  onDecrease,
  onRemove,
  onConfirm,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Chưa có sản phẩm nào</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="font-bold">
                      {(item.price * item.quantity).toLocaleString()} ₫
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <div className="flex border rounded">
                      <button onClick={() => onDecrease(item.id)}>
                        <Minus size={14} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={() => onIncrease(item.id)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <button onClick={() => onRemove(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex justify-between font-bold">
          <span>Tổng</span>
          <span>{total.toLocaleString()} ₫</span>
        </div>

        <Button className="w-full mt-3" disabled={disabled} onClick={onConfirm}>
          Xác nhận
        </Button>
      </div>
    </div>
  );
}
