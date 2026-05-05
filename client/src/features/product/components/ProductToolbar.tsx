"use client";

import { SearchBox } from "@/components/common/Search";
import { Toolbar } from "@/components/common/Toolbar";
import { ProductFilter } from "./ProductFilter";

function ProductToolbar() {
  return (
    <Toolbar
      left={"Products"}
      center={<SearchBox />}
      right={<ProductFilter />}
      className="sticky top-0 w-full z-30 bg-background/80 backdrop-blur-sm border-b"
    />
  );
}

export default ProductToolbar;
