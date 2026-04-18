"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderDetailModal } from "./OrderDetailModal";
import { formatDate } from "@/lib/utils/date-time";
import { formatCurrency } from "@/lib/utils/currency";
import { Order } from "../types";

export function OrderTable({
  orders,
  visibleCols,
}: {
  orders: Order[];
  visibleCols: (keyof Order)[];
}) {
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="border rounded-xl h-full bg-card overflow-hidden">
        <div className="h-full overflow-auto">
          <Table className="[&_th:first-child]:pl-6 [&_td:first-child]:pl-6">
            <TableHeader>
              <TableRow>
                {visibleCols.map((col) => (
                  <TableHead key={col}>{formatHeader(col)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelected(order)}
                >
                  {visibleCols.map((col) => (
                    <TableCell key={col}>{renderCell(col, order)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StatusBadge({ status }: any) {
  const map: any = {
    pending: "secondary",
    processing: "default",
    done: "outline",
  };

  const label: any = {
    pending: "Chờ",
    processing: "Đang làm",
    done: "Hoàn thành",
  };

  return <Badge variant={map[status]}>{label[status]}</Badge>;
}

const renderCell = (col: keyof Order, order: Order) => {
  switch (col) {
    case "createdAt":
      return formatDate(order.createdAt);

    case "status":
      return <StatusBadge status={order.status} />;

    case "totalPrice":
      return formatCurrency(order.totalPrice);

    default:
      return "" + order[col];
  }
};

const formatHeader = (col: keyof Order) => {
  switch (col) {
    case "id":
      return "Mã";
    case "createdAt":
      return "Thời gian";
    case "totalPrice":
      return "Tổng tiền";
    case "status":
      return "Trạng thái";
    default:
      return col;
  }
};
