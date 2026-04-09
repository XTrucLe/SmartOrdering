import { ShoppingBag } from "lucide-react";

function OrderEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="h-10 w-10" />
      </div>

      <div>
        <p className="text-lg font-medium text-foreground">
          Giỏ hàng trống trơn
        </p>

        <p className="text-sm">Hãy chọn món ngon để lấp đầy bụng đói nhé!</p>
      </div>
    </div>
  );
}

export default OrderEmpty;
