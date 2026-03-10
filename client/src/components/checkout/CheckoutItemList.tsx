import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartItem } from "../../types";
import { ImageIcon } from "lucide-react";

export function CheckoutItemList({ items }: { items: CartItem[] }) {
  return (
    <ul className="space-y-6 px-2 pb-4">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-md aspect-square">
            <AvatarImage src={item.imageUrl} alt={item.name} />
            <AvatarFallback className="rounded-md bg-muted">
              <ImageIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="font-medium leading-tight">{item.name}</div>
            <div className="text-sm text-muted-foreground">
              Số lượng: {item.quantity}
            </div>
          </div>
          <div className="text-sm font-medium tabular-nums">
            {(item.price * item.quantity).toLocaleString()}₫
          </div>
        </li>
      ))}
    </ul>
  );
}
