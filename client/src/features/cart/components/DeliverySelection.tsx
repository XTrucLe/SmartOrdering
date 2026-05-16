"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "../cart.store";
import { DeliveryTypeRenders } from "../constants/delivery";

export const DeliverySelection = () => {
  const { method, setMethod } = useCartStore();
  const methods = DeliveryTypeRenders;

  return (
    <div className={`w-full grid grid-cols-${methods.length} gap-1 p-1 px-4`}>
      {methods.map((m) => (
        <Button
          variant={method === m.value ? "default" : "outline"}
          key={m.value}
          size="sm"
          className="tracking-tight text-center"
          onClick={() => m.value !== method && setMethod(m.value)}
        >
          {m.label}
        </Button>
      ))}
    </div>
  );
};
