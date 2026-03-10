"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import EmptyPage from "@/components/common/Empty";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientRoute } from "@/routes/client.routes";

import { useCartStore } from "../../../../stores/cart.store";
import { CheckoutActions } from "../../../../components/checkout/CheckoutAction";
import { CheckoutHeader } from "../../../../components/checkout/CheckoutHeader";
import { CheckoutItemList } from "../../../../components/checkout/CheckoutItemList";
import { CheckoutNote } from "../../../../components/checkout/CheckoutNote";
import { CheckoutSummary } from "../../../../components/checkout/CheckoutSummary";
import InformationForm from "../../../../components/checkout/InformationForm";
import {
  DeliveryInfo,
  deliveryInfoSchema,
} from "../../../../lib/validations/delivery.schema";

function CheckoutPage() {
  const router = useRouter();
  const { store_slug } = useParams() as { store_slug: string | undefined };
  const { items } = useCartStore();
  const form = useForm<DeliveryInfo>({
    resolver: zodResolver(deliveryInfoSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const handleBackToMenu = () => {
    router.push(ClientRoute.menu(store_slug || ""));
  };

  if (items.length === 0) {
    return (
      <EmptyPage
        title="Giỏ hàng trống trơn"
        description="Hãy chọn món ngon để lấp đầy bụng đói nhé!"
        icon={<ShoppingBag className="h-10 w-10" />}
      >
        <Button onClick={handleBackToMenu}>Quay lại menu</Button>
      </EmptyPage>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-6 md:flex-row-reverse">
          <aside className="w-full md:w-90 flex-none">
            <InformationForm form={form} />
          </aside>

          <section className="flex-1 min-w-0">
            <div className="flex flex-col h-full bg-card rounded-xl shadow-lg">
              <div className="px-6 pt-6">
                <CheckoutHeader />
              </div>

              <Separator />

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <CheckoutItemList items={items} />
                <CheckoutNote />
              </div>

              <div className="border-t px-6 py-4 space-y-4 bg-card">
                <CheckoutSummary items={items} />
                <CheckoutActions />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
