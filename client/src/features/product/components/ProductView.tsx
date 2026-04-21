"use client";

import { Product } from "../types";
import ProductCard from "./ProductCard";
import ProductPanel from "./ProductPanel";

export function ProductView({
  products,
  selectedProduct,
  onSelect,
}: {
  products: Product[];
  selectedProduct?: Product;
  onSelect: (product?: Product) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(192px,1fr))] gap-4 p-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onSelect(product)}
          />
        ))}
        {products.length === 0 && (
          <div className="text-center text-muted-foreground col-span-full">
            Không có sản phẩm nào
          </div>
        )}
      </div>
      <ProductPanel
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => onSelect(undefined)}
      />
    </>
  );
}
