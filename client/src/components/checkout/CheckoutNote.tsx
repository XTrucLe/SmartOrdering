import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CheckoutNote() {
  return (
    <div className="space-y-2 mt-4">
      <Label htmlFor="note">Ghi chú cho quán</Label>
      <Textarea
        id="note"
        rows={4}
        placeholder="Ít cay, không hành..."
        className="resize-none overflow-x-clip h-20 ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
