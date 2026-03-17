"use client";

import { ToggleButton } from "../common/ToggleButton";
import OrderSummaryCard from "./OrderSummaryCard";
import { Order } from "@/types";

interface Props {
  orderData: Order[];
  onClick?: (id: string) => void;
}

const SortOptions = [
  { label: "Tất cả", value: "All" },
  { label: "Mới", value: "New" },
  { label: "Đang xử lý", value: "Processing" },
  { label: "Đang giao", value: "Delivering" },
  { label: "Đã giao", value: "Delivered" },
  { label: "Đã hủy", value: "Canceled" },
  { label: "Đã thanh toán", value: "Paid" },
  { label: "Chưa thanh toán", value: "Unpaid" },
];
function OrdersList({ orderData, onClick }: Props) {
  return (
    <div className="flex flex-col h-full p-2 overflow-hidden">
      {/* HEADER */}
      <div className="pb-2">
        <ToggleButton options={SortOptions} />
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
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
