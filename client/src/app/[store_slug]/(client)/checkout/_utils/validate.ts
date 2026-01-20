import { z } from "zod";

export const deliveryInfoSchema = z.object({
  name: z
    .string()
    .min(2, "Tên quá ngắn")
    .regex(/^[^\d]+$/, "Tên không được chứa số"),

  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),

  address: z.string().min(6, "Địa chỉ quá ngắn"),
});

export type DeliveryInfo = z.infer<typeof deliveryInfoSchema>;
