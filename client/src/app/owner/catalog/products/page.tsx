"use client";

import { mockProducts } from "@/data/mock-product";
import ProductToolbar from "@/features/product/components/ProductToolbar";
import { ProductView } from "@/features/product/components/ProductView";
import { useProductFilters } from "@/features/product/store/productFilter";
import { Product } from "@/features/product/types/product";
import { useMemo, useState } from "react";

function ProductPage() {
  const [products] = useState(mockProducts);
  const { filters, search, sortBy, sortOrder } = useProductFilters();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((p) =>
          key === "status"
            ? values.includes(p.isActive ? "active" : "inactive")
            : values.includes(p[key]),
        );
      }
    });

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return result;
  }, [products, filters, search]);

  return (
    <div className="flex flex-col overflow-hidden h-full w-full">
      <ProductToolbar />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ProductView
          products={filteredProducts}
          selectedProduct={selectedProduct}
          onSelect={setSelectedProduct}
        />
      </div>
    </div>
  );
}

export default ProductPage;
