"use client";

import OrderSummaryCard from "./OrderSummaryCard";
import { Order } from "@/types";

interface Props {
  orderData: Order[];
  onClick?: (id: string) => void;
}

function OrdersList({ orderData, onClick }: Props) {
  return (
    <div className="flex min-h-0 h-full min-w-75 flex-col overflow-hidden p-2 pt-1 pr-0">
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {!orderData.length && (
          <div className="text-center text-sm text-muted-foreground py-6">
            Không có đơn hàng
          </div>
        )}

        {orderData.map((order) => (
          <OrderSummaryCard
            key={order.id}
            order={order}
            onClick={() => onClick?.(order.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default OrdersList;
