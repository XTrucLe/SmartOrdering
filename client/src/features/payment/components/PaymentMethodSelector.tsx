"use client";

import { cn } from "@/lib/utils";
import { PAYMENT_METHODS, PaymentMethods } from "../constants";
import { PaymentMethod } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "./ConfirmModal";
import { useState } from "react";

type Props = {
  value?: PaymentMethod;
  onChange?: (method: PaymentMethod) => void;

  onConfirm?: () => void;
  onCancel?: () => void;
};

export const PaymentMethodSelector = ({
  value,
  onChange,
  onConfirm,
  onCancel,
}: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmOrder = () => {
    setShowConfirm(false);
    onConfirm?.();
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-popover p-6">
      <h3 className="border-b pb-2 text-lg font-semibold">
        Phương thức thanh toán
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {Object.values(PAYMENT_METHODS).map((method) => {
          const Icon = method.icon;

          const isSelected = value === method.value;

          return (
            <button
              key={method.value}
              type="button"
              onClick={() => !method.disabled && onChange?.(method.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors",
                "hover:bg-muted",
                isSelected && "border-primary bg-primary/5",
                method.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <Icon className="size-5" />

              <span className="text-sm font-medium">{method.label}</span>
            </button>
          );
        })}
      </div>

      {value === PaymentMethods.CASH && (
        <div className="space-y-2 rounded-lg border p-4">
          <label className="text-sm font-medium">Số tiền nhận</label>

          <Input
            type="number"
            placeholder="Nhập số tiền mặt"
            className="ring-0 focus:ring-0 outline-none focus:outline-none"
            error={
              value === PaymentMethods.CASH && !onChange
                ? "Vui lòng nhập số tiền"
                : undefined
            }
          />
        </div>
      )}

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Quay lại
        </Button>

        <Button disabled={!value} onClick={() => setShowConfirm(true)}>
          Xác nhận thanh toán
        </Button>
      </div>

      <ConfirmModal
        title="Xác nhận thanh toán"
        content="Bạn có chắc chắn muốn xác nhận thanh toán bằng tiền mặt và nhận đủ số tiền khách đưa không?"
        open={showConfirm}
        onConfirm={confirmOrder}
        onCancel={setShowConfirm.bind(null, false)}
      />
    </div>
  );
};
