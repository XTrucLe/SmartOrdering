import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import OrderEmpty from "./OrderEmpty";
import { OrderedItem } from "@/types";

interface Props {
  items: OrderedItem[];
  total: number;
  disabled: boolean;

  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;

  onConfirm: () => void;
}

export default function OrderPanel({
  items,
  total,
  disabled,
  onIncrease,
  onDecrease,
  onRemove,
  onConfirm,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-2">
        {items.length === 0 ? (
          <OrderEmpty />
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                onIncrease={() => onIncrease(item.id)}
                onDecrease={() => onDecrease(item.id)}
                onRemove={() => onRemove(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <OrderSummary total={total} disabled={disabled} onConfirm={onConfirm} />
    </div>
  );
}
