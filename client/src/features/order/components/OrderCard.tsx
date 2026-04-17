"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ORDER_ACTIONS,
  ORDER_STATUS,
  ORDER_STATUS_LABEL,
  OrderStatus,
} from "../constants/order.constant";
import { ORDER_STATUS_UI } from "../domain/orderStatus.config";
import { getNextStatuses, transition } from "../domain/orderFlow.service";

import { Order } from "../types";
import { formatDate } from "@/lib/utils/date-time";
import { toSentenceCase } from "@/lib/utils/string";

interface Props {
  order: Order;
  onClick?: () => void;
}

export default function OrderCard({ order, onClick }: Props) {
  const ui = ORDER_STATUS_UI[order.status];
  const actions = getNextStatuses(order.status);

  return (
    <Card
      onClick={onClick}
      className={cn(
        "mb-4 w-full h-96 max-w-72 cursor-pointer border-l-4 hover:shadow-sm",
        ui.border,
      )}
    >
      <CardHeader className="border-b">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">#{order.id}</span>
          <span className="flex items-center gap-1 ">
            <Clock size={16} />
            {formatDate(order.createdAt, { timeStyle: "short" })}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <StatusBadge status={order.status} />
          {toSentenceCase(order.deliveryMethod.replace(/_/g, " "))}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="truncate">{item.itemName}</span>
              <span className="text-muted-foreground">×{item.quantity}</span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="border-t pt-2 text-xs text-muted-foreground">
            {order.notes}
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex flex-col border-t">
        <div className="flex  w-full flex-row gap-2">
          <Button
            size="sm"
            variant="outline"
            className=""
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Printer className="h-4 w-4" />
          </Button>
          {actions.map((action) => (
            <Button
              key={action}
              size="sm"
              className="flex-1 gap-1"
              onClick={async (e) => {
                e.stopPropagation();
                await transition(order.status, action, {
                  orderId: order.id,
                });
              }}
            >
              {action === ORDER_STATUS.COMPLETED && (
                <Printer className="h-4 w-4" />
              )}
              {ORDER_ACTIONS[action]}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-1 text-xs font-medium",
        ORDER_STATUS_UI[status].badge,
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
