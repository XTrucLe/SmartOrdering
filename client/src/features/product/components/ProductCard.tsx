"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Product } from "../types";
import { cn } from "@/lib/utils";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { CommonDropdown } from "@/components/common/CommonDropdown";

function ProductCard({
  product,
  onClick,
  dropdownClick,
}: {
  product: Product;
  onClick: () => void;
  dropdownClick?: ({ action, id }: { action: string; id: string }) => void;
}) {
  return (
    <Card
      className="group overflow-hidden p-0 hover:shadow-md transition min-h-64 max-h-72"
      onClick={onClick}
    >
      <div className="relative w-full h-44">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          className="object-cover transition-transform group-hover:scale-105"
        />

        <CommonDropdown
          trigger={
            <Button
              variant="ghost"
              className="absolute top-1 right-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:ring-0 p-1.5 px-2!"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
          items={[
            {
              label: "Chỉnh sửa",
              icon: <Edit className="w-4 h-4" />,
              onClick: () =>
                dropdownClick?.({ action: "edit", id: product.id }),
            },
            {
              separator: true,
            },
            {
              label: "Xóa",
              icon: <Trash className="w-4 h-4" color="var(--error)" />,
              variant: "destructive",
              onClick: () =>
                dropdownClick?.({ action: "delete", id: product.id }),
            },
          ]}
          className="w-20"
        />

        <div
          className={cn(
            "absolute bottom-2 left-2 px-2 py-1 text-xs rounded-full flex items-center gap-1.5 backdrop-blur",
            product.isActive
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white",
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {product.isActive ? "Hoạt động" : "Ngưng"}
        </div>
      </div>

      <div className="p-4 pt-2 space-y-1.5">
        <h3 className="font-medium leading-tight line-clamp-1">
          {product.name}{" "}
          <span className="text-xs text-muted-foreground">
            ({product.unit})
          </span>
        </h3>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 h-10 indent-2">
            {product.description}
          </p>
        )}
      </div>
    </Card>
  );
}

export default memo(ProductCard);
