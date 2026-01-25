import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { MapPin, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { DeliveryInfo } from "../_utils/validate";

type Props = {
  form: UseFormReturn<DeliveryInfo>;
};

function InformationForm({ form }: Props) {
  const [isEditing, setIsEditing] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const [name, phone, address] = useWatch({
    control,
    name: ["name", "phone", "address"],
  });

  const isEmpty = !name || !phone || !address;

  const onSave = handleSubmit(() => {
    setIsEditing(false);
  });

  const onCancel = () => {
    reset({ name, phone, address });
    setIsEditing(false);
  };

  return (
    <aside className="bg-card rounded-xl p-5 space-y-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold tracking-tight">
          Thông tin giao hàng
        </h3>

        {!isEditing && !isEmpty && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-auto p-0 text-muted-foreground hover:text-primary"
          >
            Thay đổi
          </Button>
        )}
      </div>

      {!isEditing && !isEmpty && (
        <div className="rounded-lg bg-muted/40 p-4 border border-dashed">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="font-semibold text-foreground">{name}</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">{phone}</p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="flex-1 text-muted-foreground leading-snug">
                {address}
              </p>
            </div>
          </div>
        </div>
      )}

      {(isEditing || isEmpty) && (
        <form onSubmit={onSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Họ và tên</Label>
            <Input
              {...register("name")}
              placeholder="Nguyễn Văn A"
              error={errors.name?.message}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Số điện thoại</Label>
            <Input
              {...register("phone")}
              placeholder="0123 456 789"
              error={errors.phone?.message}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Địa chỉ</Label>
            <Input
              {...register("address")}
              placeholder="123 Nguyễn Trãi, Q1"
              error={errors.address?.message}
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            {!isEmpty && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            )}

            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              Lưu
            </Button>
          </div>
        </form>
      )}
    </aside>
  );
}

export default InformationForm;
