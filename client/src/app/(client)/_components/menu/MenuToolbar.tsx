import { SectionTabs } from "@/components/menu/SectionTabs";
import { CartButton } from "../../../../components/cart/CartButton";
import ItemCheckList from "../../../../components/cart/ItemCheckList";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Section } from "@/types";

export function MenuToolbar({
  sections,
  activeId,
  cartQuantity,
}: {
  sections: Section[];
  activeId: string;
  cartQuantity: number;
}) {
  return (
    <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <SectionTabs
          sections={sections}
          activeId={activeId}
          onSelect={(id) =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
        />

        <div className="ml-auto mr-4">
          <Sheet>
            <SheetTrigger asChild>
              <CartButton quantity={cartQuantity} />
            </SheetTrigger>
            <ItemCheckList />
          </Sheet>
        </div>
      </div>
    </div>
  );
}
