import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format/date-time";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { formatCurrency } from "@/lib/format/money";

function OrderDetail({ order }: { order: Order | null }) {
  if (!order)
    return (
      <Card className="flex flex-1 flex-col h-full rounded-none border-l items-center justify-center">
        <h3>Chưa có thông tin đơn hàng</h3>
        <p>Vui lòng chọn đơn hàng bên cột trái để xem chi tiết</p>
      </Card>
    );

  const orderTime = formatDateTime(new Date(order.createdAt));
  const totalItem = order.orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <Card className="flex flex-1 flex-col h-full rounded-none border-l">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3! border-b">
        <div className="flex flex-col">
          <h4 className="font-semibold text-base">
            Order #{order.id.slice(-4)}
          </h4>
          <span className="text-xs text-muted-foreground">{orderTime}</span>
        </div>

        <Badge variant="secondary" className="text-xs">
          {order.status}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0 min-h-0">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-md font-medium">Chi tiết đơn</span>
          <span className="text-xs text-muted-foreground">{totalItem} món</span>
        </div>

        <div className="flex flex-col custom-scrollbar overflow-y-scroll">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-1.5 text-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{item.quantity}x</span>
                <span className="font-medium">{item.itemName}</span>
              </div>

              <span className="font-medium">
                {item.totalPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col p-0">
        <div className="w-full border-t">
          <div className="px-4 py-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(order.subTotal)}</span>
          </div>

          <div className="px-4 py-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span>{formatCurrency(order.deliveryFee)}</span>
          </div>

          <div className="mx-4 border-t border-dashed" />

          <div className="px-4 py-3 flex items-center justify-between">
            <span className="font-medium">Tổng</span>
            <span className="font-semibold text-base">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>

        <div className="w-full px-4 pb-8">
          <div className="flex gap-2">
            {order.status === "PENDING" && (
              <>
                <Button variant="outline" className="flex-1">
                  Huỷ
                </Button>
                <Button className="flex-1">Xác nhận</Button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <>
                <Button variant="outline" className="flex-1">
                  Huỷ
                </Button>
                <Button className="flex-1">Hoàn thành</Button>
              </>
            )}

            {order.status === "COMPLETED" && (
              <Button variant="secondary" className="max-w-64 w-full mx-auto">
                In hoá đơn
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
export default OrderDetail;
