import { redirect } from "next/navigation";

function CatalogPage() {
  return redirect("/owner/catalog/categories");
}

export default CatalogPage;
