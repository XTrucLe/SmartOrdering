import { Separator } from "@/components/ui/separator";
import { CartItem } from "../../types";

export function CheckoutSummary({
  items,
  serviceFee = 25000,
}: {
  items: CartItem[];
  serviceFee?: number;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + serviceFee;

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium tabular-nums">
            {subtotal.toLocaleString()}₫
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí dịch vụ</span>
          <span className="font-medium tabular-nums">
            {serviceFee.toLocaleString()}₫
          </span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold text-lg">
        <span>Tổng cộng</span>
        <span className="tabular-nums">{total.toLocaleString()}₫</span>
      </div>
    </div>
  );
}
