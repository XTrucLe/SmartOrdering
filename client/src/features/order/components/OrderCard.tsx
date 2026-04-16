"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Order, ORDER_STATUS, ORDER_STATUS_LABEL, OrderStatus } from "../types";
import { VALID_TRANSITIONS } from "../constants/transition";
import { getElapsedTime } from "@/lib/utils/elapsedTime";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

interface Props {
  order: Order;
  onClick?: () => void;
}

function OrderCard({ order, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "mb-4 w-full h-80 max-w-md cursor-pointer transition hover:shadow-sm border-l-4 py-4",
        getStatusBorder(order.status),
      )}
    >
      <CardHeader className=" pb-2">
        <div className="flex items-center justify-between text-sm">
          <span>{order.deliveryMethod}</span>
          <span className="font-medium">#{order.id}</span>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(order.totalPrice)}</span>⏱{" "}
          {getElapsedTime(new Date(order.createdAt), new Date())}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <div className="space-y-1">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="truncate">{item.itemName}</span>
              <span className="text-muted-foreground">×{item.quantity}</span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            {order.notes}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2 mt-auto">
        <ActionButtons id={order.id} status={order.status} />
      </CardFooter>
    </Card>
  );
}

function ActionButtons({ id, status }: { id: string; status: OrderStatus }) {
  const nextActions = VALID_TRANSITIONS[status];

  return (
    <div className="flex w-full gap-2 flex-row-reverse">
      {nextActions?.map((action) => (
        <Button
          key={id + action}
          size="sm"
          className={cn("flex-1 gap-1")}
          variant={getActionVariant(action)}
          onClick={(e) => {
            e.stopPropagation();
            console.log(action);
          }}
        >
          {action === ORDER_STATUS.COMPLETED && <Printer className="w-4 h-4" />}
          {ORDER_STATUS_LABEL[action as keyof typeof ORDER_STATUS_LABEL]}
        </Button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "text-xs px-2 py-1 rounded-md font-medium border",
        getStatusBadge(status),
      )}
    >
      {status}
    </span>
  );
}

function getStatusBorder(status: OrderStatus) {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "border-l-muted";
    case ORDER_STATUS.PROCESSING:
      return "border-l-primary";
    case ORDER_STATUS.READY:
      return "border-l-success";
    case ORDER_STATUS.CANCELLED:
      return "border-l-destructive";
    case ORDER_STATUS.COMPLETED:
      return "border-l-muted-foreground";
    default:
      return "";
  }
}

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "bg-muted text-muted-foreground";
    case ORDER_STATUS.PROCESSING:
      return "bg-primary/10 text-primary";
    case ORDER_STATUS.READY:
      return "bg-success/10 text-success";
    case ORDER_STATUS.CANCELLED:
      return "bg-destructive/10 text-destructive";
    case ORDER_STATUS.COMPLETED:
      return "bg-muted text-muted-foreground";
    default:
      return "";
  }
}

function getActionVariant(action: string) {
  if (action === ORDER_STATUS.CANCELLED) return "destructive";
  if (action === ORDER_STATUS.PENDING) return "default";
  if (action === ORDER_STATUS.READY) return "secondary";
  if (action === ORDER_STATUS.COMPLETED) return "outline";
  return "default";
}

export default OrderCard;
