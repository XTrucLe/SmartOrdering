import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { OrderedItem } from "@/types";

interface Props {
  item: OrderedItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

function OrderItem({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <div className="group flex gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No IMG
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="pr-4">
            <h3 className="line-clamp-2 text-sm font-semibold">{item.name}</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {item.price.toLocaleString()} ₫ /{item.unit}
            </p>
          </div>

          <p className="text-sm font-bold">
            {(item.price * item.quantity).toLocaleString()} ₫
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex h-8 items-center rounded-md border border-border">
            <button
              className="flex h-full w-8 items-center justify-center hover:bg-accent"
              onClick={onDecrease}
            >
              <Minus className="h-3 w-3" />
            </button>

            <div className="flex h-full w-8 items-center justify-center border-x border-border bg-muted/50 text-sm font-medium">
              {item.quantity}
            </div>

            <button
              className="flex h-full w-8 items-center justify-center hover:bg-accent"
              onClick={onIncrease}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
