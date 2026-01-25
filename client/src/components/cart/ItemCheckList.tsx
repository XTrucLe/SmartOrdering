import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "../../stores/cart.store";
import { useParams, useRouter } from "next/navigation";
import { ClientRoute } from "@/routes/client";

function ItemCheckList() {
  const { items, changeQuantity, removeItem, getTotalPrice } = useCartStore();
  const total = getTotalPrice();
  const router = useRouter();

  const { store_slug } = useParams() as { store_slug: string | undefined };

  const handleConfirm = () => {
    const route = ClientRoute.checkout(store_slug || "");
    router.push(route);
  };

  return (
    <SheetContent className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md">
      <SheetHeader className="border-b border-border px-6 py-4">
        <SheetTitle className="flex items-center gap-2 text-xl font-bold">
          <ShoppingBag className="h-5 w-5" />
          Giỏ hàng
          <span className="ml-auto mr-3 -mb-5 text-sm font-normal text-muted-foreground">
            ({items.length} món)
          </span>
        </SheetTitle>
      </SheetHeader>

      <div className="no-scrollbar no-select flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Giỏ hàng trống trơn
              </p>
              <p className="text-sm">
                Hãy chọn món ngon để lấp đầy bụng đói nhé!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((product) => (
              <div key={product.id} className="group flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                      No IMG
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="pr-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.price.toLocaleString()} ₫ /{product.unit}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {(product.price * product.quantity).toLocaleString()} ₫
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex h-8 items-center rounded-md border border-border">
                      <button
                        className="flex h-full w-8 items-center justify-center transition hover:bg-accent disabled:opacity-50"
                        onClick={() => changeQuantity(product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <div className="flex h-full w-8 items-center justify-center border-x border-border bg-muted/50 text-sm font-medium">
                        {product.quantity}
                      </div>

                      <button
                        className="flex h-full w-8 items-center justify-center transition hover:bg-accent"
                        onClick={() => changeQuantity(product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      title="Xóa món"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card p-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tạm tính</span>
            <span>{total.toLocaleString()} ₫</span>
          </div>

          <div className="flex justify-between text-base font-bold">
            <span>Tổng cộng</span>
            <span className="text-xl text-primary">
              {total.toLocaleString()} ₫
            </span>
          </div>

          <Button
            size="lg"
            className="w-full text-base font-bold"
            disabled={items.length === 0}
            onClick={handleConfirm}
          >
            Xác nhận đặt hàng
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}

export default ItemCheckList;
