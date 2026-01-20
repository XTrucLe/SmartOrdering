import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmOrder() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Xác nhận đặt hàng</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Bạn có chắc chắn muốn đặt hàng với các món đã chọn không?
      </DialogDescription>
      <DialogFooter className="mt-4">
        <Button variant="outline">Hủy</Button>
        <Button>Xác nhận</Button>
      </DialogFooter>
    </DialogContent>
  );
}
