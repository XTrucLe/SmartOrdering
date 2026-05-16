"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Printer,
  ShoppingBag,
  User,
  FileText,
  Check,
  X,
  CheckCheck,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { DeliveryTypeRenders } from "@/features/cart/constants/delivery";

interface Props {
  order: Order;
  onClick?: () => void;
}

export default function OrderCard({ order, onClick }: Props) {
  const actions = getNextStatuses(order.status);
  const router = useRouter();
  const methodLabel = DeliveryTypeRenders.find(
    (d) => d.value === order.deliveryMethod,
  )?.label;

  const handleTransition = async (order: Order, nextStatus: OrderStatus) => {
    console.log(order);

    if (
      order.paymentStatus !== "PAID" &&
      nextStatus === ORDER_STATUS.COMPLETED
    ) {
      router.push(`/staff/payment/${order.id}`);
    } else
      await transition(order.status, nextStatus, {
        orderId: order.id,
      });
  };

  return (
    <Card
      key={order.orderCode}
      onClick={onClick}
      className={cn(
        "flex flex-col h-100 w-full max-w-sm cursor-pointer",
        "transition-all duration-200 hover:shadow-md select-none bg-card text-card-foreground hover:border-primary/90",
      )}
    >
      <CardHeader className="p-2 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-foreground select-text">
              #{order.orderCode?.split("-")[1] || order.id.slice(-4)}
            </span>

            {order.paymentStatus === "PAID" ? (
              <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/90">
                Đã trả
              </span>
            ) : (
              <span className="inline-flex items-center rounded border border-destructive/20 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                Chưa trả
              </span>
            )}
          </div>

          <StatusBadge status={order.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-35 font-medium text-foreground/80 flex items-center gap-1">
            {order?.customerName ? (
              <>
                <User className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                {order.customerName}
              </>
            ) : (
              "Khách vãng lai"
            )}
          </span>

          <span className="shrink-0 text-[12px] font-medium tracking-wide text-muted-foreground/90 mr-1">
            {methodLabel}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div className="divide-y divide-border/40">
          {order.orderItems.map((item, id) => (
            <div key={id} className="py-2 first:pt-0 last:pb-0 space-y-0.5">
              <div className="flex items-start gap-1.5 text-sm">
                <span className="font-mono text-sm font-medium text-muted-foreground/80 whitespace-nowrap select-none">
                  {item.quantity}x
                </span>

                <span className="flex-1 font-medium text-foreground leading-tight wrap-break-word">
                  {item.name}
                </span>
              </div>

              {item.options && item.options.length > 0 && (
                <p className="text-xs text-muted-foreground/80 pl-1 border-l-2 border-muted">
                  {item.options.map((opt) => opt.optionName).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground border border-dashed border-border flex gap-1.5 items-start">
            <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="italic">{order.notes}</span>
          </div>
        )}
      </CardContent>

      {(() => {
        const showPrintButton = order.status === ORDER_STATUS.COMPLETED;
        const hasActions = actions.length > 0;

        if (!showPrintButton && !hasActions) return null;

        return (
          <CardFooter className="p-4 pt-3 border-t border-border bg-muted/5 mt-auto">
            <div className="flex w-full gap-2 items-center">
              {showPrintButton && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Code xử lý in hóa đơn tại đây
                  }}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              )}

              {actions.map((action) => {
                const isCompleted = action === ORDER_STATUS.COMPLETED;
                const isCancelled = action === ORDER_STATUS.CANCELLED;

                const btnVariant = isCompleted
                  ? "default"
                  : isCancelled
                    ? "destructive"
                    : "secondary";

                const ActionIcon = (() => {
                  if (action === ORDER_STATUS.CONFIRMED) return Check;
                  if (action === ORDER_STATUS.COMPLETED) return CheckCheck;
                  if (action === ORDER_STATUS.CANCELLED) return X;
                  return null;
                })();

                return (
                  <Button
                    key={action}
                    size="sm"
                    variant={btnVariant}
                    className={cn(
                      "flex-1 h-9 font-medium shadow-none gap-1.5 text-xs transition-all",
                      isCancelled &&
                        "hover:text-destructive hover:bg-destructive/10 font-normal flex-0.5",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTransition(order, action);
                    }}
                  >
                    {ActionIcon && (
                      <ActionIcon className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{ORDER_ACTIONS[action]}</span>
                  </Button>
                );
              })}
            </div>
          </CardFooter>
        );
      })()}
    </Card>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 -mr-1 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        ORDER_STATUS_UI[status]?.badge,
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
