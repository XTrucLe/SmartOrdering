import { CartItem } from "@/features/cart/types";
import { formatCurrency } from "@/lib/utils/currency";

type Props = {
  items: CartItem[];
};

export const PaymentReview = ({ items }: Props) => {
  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <div className="flex h-full w-full flex-col rounded-xl border bg-popover">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Hóa đơn thanh toán</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-75">
        {items.map((item, id) => (
          <div key={id} className="flex-col w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {item.name}

                  <span className="ml-1 text-muted-foreground">
                    ×{item.quantity}
                  </span>
                </p>
              </div>

              <span className="shrink-0 text-sm">
                {formatCurrency(item.unitPrice * item.quantity, "VND")}
              </span>
            </div>
            {item.options?.length ? (
              <p className="text-xs text-muted-foreground">
                ·{" "}
                {item.options
                  .map((option) => option.optionName)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="border-t p-4 py-2 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>VAT (10%)</span>

          <span>{formatCurrency(total - total / 1.1, "VND")}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Tổng cộng</span>

          <span className="text-lg font-semibold">
            {formatCurrency(total, "VND")}
          </span>
        </div>
      </div>
    </div>
  );
};
