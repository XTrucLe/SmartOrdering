import { Order } from "@/types";
import { Clock, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/format/date-time";
import { formatCurrency } from "@/lib/format/money";

type OrderSummaryCardProps = {
  order: Order;
  onClick: () => void;
  isActive?: boolean;
};

function OrderSummaryCard({ order, onClick, isActive }: OrderSummaryCardProps) {
  const totalItem = order.orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-200
        hover:bg-muted/50 hover:shadow-sm
        ${isActive ? "ring-2 ring-primary" : ""}
      `}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            #{order.id.slice(-4)} · {order.customerName || "Khách vãng lai"}
          </span>

          <Badge variant="secondary" className="text-xs">
            {order.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {formatTime(new Date(order.createdAt))}
          </div>

          <div className="flex items-center gap-1">
            <UtensilsCrossed size={14} />
            {order.table || "Mang đi"}
          </div>

          <span>{totalItem} món</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {formatCurrency(order.totalPrice)}
          </span>

          <Badge variant="outline" className="text-xs">
            {order.paymentStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderSummaryCard;
