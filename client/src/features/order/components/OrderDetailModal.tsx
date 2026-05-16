"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "../types";
import { Info, Row } from "./OrderRow";

export function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-105 max-w-full p-0 overflow-hidden">
        {/* HEADER */}
        <div className="px-5 py-4 border-b bg-muted/30">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Order #{order?.id}
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Created at: {order?.createdAt}
            </DialogDescription>
          </DialogHeader>
        </div>

        {order && (
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-2">Items</h3>

              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item.signature}
                    className="flex items-start justify-between text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>

                    <div className="text-right">
                      {item.totalPrice.toLocaleString()}đ
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              <Row label="Subtotal" value={order.subTotal} />
              <Row label="Delivery" value={order.deliveryFee} />
              <Row label="Total" value={order.totalPrice} bold />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <Info label="Status" value={order.status} />
              <Info label="Payment" value={order.paymentStatus} />
              <Info label="Delivery" value={order.deliveryMethod} />
              {order.table && <Info label="Table" value={order.table} />}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
