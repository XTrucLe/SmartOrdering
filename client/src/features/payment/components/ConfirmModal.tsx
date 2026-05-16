import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  title: string;
  content: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  title,
  content,
  open,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm indent-1">{content}</p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            className="btn btn-outline"
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button className="btn bg" onClick={onConfirm}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
