"use client";

import { Order } from "@/features/order/types";
import { PaymentMethodSelector } from "@/features/payment/components/PaymentMethodSelector";
import { PaymentReview } from "@/features/payment/components/PaymentReview";
import {
  completeOrder,
  payOrderByCash,
} from "@/features/payment/services/payment";
import { PaymentMethod } from "@/features/payment/types";
import { OrderService } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const router = useRouter();
  const { orderId } = useParams() as { orderId: string };
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CASH");
  const [order, setOrder] = useState<Order | null>(null);

  const handleConfirm = async () => {
    try {
      await payOrderByCash(orderId!);
      if (order?.status === "CONFIRMED") await completeOrder(orderId!);
      router.back();
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (!orderId) {
      router.push("/staff/orders");
    }
    const getOrder = async () => {
      try {
        const { data } = await OrderService.getOrder(orderId!);
        setOrder(data);
      } catch (error) {}
    };
    getOrder();
  }, [orderId, router]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl w-full mx-auto">
        <PaymentReview items={order?.orderItems || []} />
        <PaymentMethodSelector
          value={selectedMethod}
          onChange={setSelectedMethod}
          onCancel={() => router.back()}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
