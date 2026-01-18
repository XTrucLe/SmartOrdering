import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/app/(client)/product-store";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

function ProductCheckList() {
  const {
    selectedProducts: products,
    removeProduct,
    changeQuantity,
    totalPrice,
  } = useProductStore();

  const total = totalPrice();

  return (
    <SheetContent className="flex flex-col h-full w-full sm:max-w-md p-0 gap-0  ">
      <SheetHeader className="px-6 py-4 border-b">
        <SheetTitle className="flex items-center gap-2 text-xl font-bold">
          <ShoppingBag className="w-5 h-5" />
          Giỏ hàng
          <span className="text-sm font-normal text-muted-foreground ml-auto mr-3">
            ({products.length} món)
          </span>
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">
                Giỏ hàng trống trơn
              </p>
              <p className="text-sm text-slate-500">
                Hãy chọn món ngon để lấp đầy bụng đói nhé!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="flex gap-4 group">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-slate-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 font-medium">
                      No IMG
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="pr-4">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.price.toLocaleString()} ₫
                      </p>
                    </div>
                    {/* Tổng tiền của riêng món đó */}
                    <p className="font-bold text-sm">
                      {(product.price * product.quantity).toLocaleString()} ₫
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md h-8">
                      <button
                        className="h-full w-8 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50"
                        onClick={() => changeQuantity(product.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="h-full w-8 flex items-center justify-center text-sm font-medium border-x bg-slate-50/50">
                        {product.quantity}
                      </div>
                      <button
                        className="h-full w-8 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        onClick={() => changeQuantity(product.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeProduct(product.id)}
                      className="text-muted-foreground hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Xóa món"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. FOOTER: Sticky Bottom & Shadow */}
      <div className="border-t bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
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
            className="w-full text-base font-bold shadow-lg"
            disabled={products.length === 0}
          >
            Thanh toán ngay
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}

export default ProductCheckList;
