import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  disabled: boolean;
  onConfirm: () => void;
}

function OrderSummary({ total, disabled, onConfirm }: Props) {
  return (
    <div className="border-t border-border bg-card p-6">
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tạm tính</span>
          <span>{total.toLocaleString()} ₫</span>
        </div>

        <div className="flex justify-between text-base font-bold">
          <span>Tổng cộng</span>
          <span className="text-xl text-primary">
            {total.toLocaleString()} ₫
          </span>
        </div>

        <Button
          size="lg"
          className="w-full text-base font-bold"
          disabled={disabled}
          onClick={onConfirm}
        >
          Xác nhận đặt hàng
        </Button>
      </div>
    </div>
  );
}

export default OrderSummary;
