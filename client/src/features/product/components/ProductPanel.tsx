"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Product } from "../types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function ProductPanel({
  product,
  open,
  onClose,
}: {
  product: Product | undefined;
  open: boolean;
  onClose?: () => void;
}) {
  if (!product) return null;
  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-full md:max-w-96 h-screen">
        <DrawerHeader className="border-b flex flex-row items-center justify-between">
          <DrawerTitle>Chi tiết sản phẩm</DrawerTitle>
          <Button className="ml-auto" variant="outline">
            Chỉnh sửa
          </Button>
        </DrawerHeader>
        <div className="grid grid-row-2">
          {!product && (
            <div className="text-center text-muted-foreground">
              Chọn một sản phẩm để xem chi tiết
            </div>
          )}
          {product && (
            <div className="p-4">
              <div className="flex flex-row">
                <div className="relative flex  w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <span className="indent-2">
                    Đơn vị bán: <i>{product.unit}</i>
                  </span>
                  <p className="indent-2 ">
                    Trạng thái:{" "}
                    <i>
                      {" "}
                      {product.isActive ? "Đang được bán" : "Không được bán"}
                    </i>
                  </p>
                </div>
              </div>

              <p className="indent-2">{product.description}</p>
              {product?.categories && product.categories.length > 0 && (
                <div className="mt-2">
                  <span className="indent-2">Danh mục: </span>
                  {product.categories.map((cat) => (
                    <Badge key={cat.id} className="ml-2">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex pt-2 p-4 pb-2 mt-auto flex-col">
            <h4 className="text-md p-4 font-semibold">Nguyên liệu</h4>
            <Separator />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ProductPanel;
