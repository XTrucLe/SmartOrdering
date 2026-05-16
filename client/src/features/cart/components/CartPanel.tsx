"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/index";
import { useCartStore } from "../cart.store";

type CartPanelProps = {
  handleCheckout: () => void;
  handleDelayedCheckout: () => void;
};

export function CartPanel({
  handleCheckout,
  handleDelayedCheckout,
}: CartPanelProps) {
  const { items, changeQuantity, getTotalAmount, removeItem } = useCartStore();
  const total = getTotalAmount();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Chưa có sản phẩm nào</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.signature + item.itemId}
                className="flex gap-4 border-b pb-2"
              >
                <div className="relative h-18 w-18 rounded-md overflow-hidden border">
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
                    <span className="text-sm font-semibold flex-nowrap line-clamp-1">
                      {item.name}
                    </span>
                    <span className="font-semibold text-sm shrink-0">
                      {formatCurrency(item.totalPrice, item.currency)}
                    </span>
                  </div>
                  <div className="flex ml-1">
                    {item?.options?.length ? (
                      <span className="text-xs text-muted-foreground">
                        {item.options
                          .map((option) => option.optionName)
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex justify-between mt-2 ">
                    <div className="flex border rounded px-2">
                      <button
                        onClick={() => changeQuantity(item.signature, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 border-r border-l mx-2">
                        {item.quantity}
                      </span>
                      <button onClick={() => changeQuantity(item.signature, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.itemId, item.signature)}
                    >
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
          <span>{formatCurrency(total, "VND")}</span>
        </div>

        <div className="group flex flex-row flex-wrap items-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={!items.length}
            onClick={handleDelayedCheckout}
          >
            Xác nhận đơn
          </Button>
          <Button
            disabled={!items.length}
            onClick={handleCheckout}
            className="flex-1"
          >
            Thanh toán ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
