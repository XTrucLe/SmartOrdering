import { MenuNav } from "@/components/menu/MenuNav";
import { CartButton } from "../orders/CartButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Section } from "@/types";
import { ShoppingBag } from "lucide-react";
import CartPanel from "../orders/CartPanel";
import { useParams, useRouter } from "next/navigation";
import { ClientRoute } from "@/routes/client.routes";

export function MenuToolbar({
  sections,
  activeId,
  cartQuantity,
}: {
  sections: Section[];
  activeId: string;
  cartQuantity: number;
}) {
  const scrollOffset = 80;
  const router = useRouter();
  const { store_slug } = useParams<{ store_slug: string }>();

  const handleSelect = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const handleConfirm = () => router.push(ClientRoute.checkout(store_slug));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <div className="flex-1 min-w-0">
          <MenuNav
            sections={sections}
            activeId={activeId}
            onSelect={handleSelect}
            isEmbedded={true}
            variant="horizontal"
          />
        </div>

        <div className="shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative cursor-pointer transition-transform active:scale-90">
                <CartButton quantity={cartQuantity} />
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="border-b border-border px-6 py-2">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                  <ShoppingBag className="h-5 w-5" />
                  Giỏ hàng
                </SheetTitle>
              </SheetHeader>
              <CartPanel onConfirm={handleConfirm} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
