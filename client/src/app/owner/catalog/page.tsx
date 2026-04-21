import { redirect } from "next/navigation";

function CatalogPage() {
  return redirect("/owner/catalog/products");
}

export default CatalogPage;
