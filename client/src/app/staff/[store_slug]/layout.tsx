"use client";

import { useMemo } from "react";
import { useQueryState } from "@/hooks/useQueryParam";
import StaffHeader from "@/components/layouts/StaffHeader";
import { ShoppingCart, Clock, History } from "lucide-react";
import { TopBar } from "@/components/common/ModeSwitch";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Mode } from "@/types/ui/ModeSwitch.type";

type TabMode = "pos" | "orders" | "history";

const MODES: Mode[] = [
  {
    value: "pos",
    label: "POS",
    icon: <ShoppingCart size={16} />,
  },
  {
    value: "orders",
    label: "Orders",
    icon: <Clock size={16} />,
  },
  {
    value: "history",
    label: "History",
    icon: <History size={16} />,
  },
];

export const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const storeSlug = Array.isArray(params.store_slug)
    ? params.store_slug[0]
    : params.store_slug;

  const tabMode = useMemo<TabMode>(() => {
    if (pathname.includes("orders")) return "orders";
    if (pathname.includes("history")) return "history";
    return "pos";
  }, [pathname]);

  const [query, setQuery] = useQueryState({
    key: "q",
    defaultValue: "",
    parse: (v) => v,
    serialize: (v) => v,
  });

  const handleChangeMode = (mode: Mode) => {
    const search = new URLSearchParams();

    if (query) {
      search.set("q", query);
    }

    const nextUrl = `/staff/${storeSlug}/${mode.value}${
      search.toString() ? `?${search.toString()}` : ""
    }`;

    router.replace(nextUrl);
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col min-h-0">
        <StaffHeader query={query ?? ""} setQuery={setQuery}>
          <div className="ml-4 mt-2">
            <TopBar
              modes={MODES}
              activeMode={tabMode}
              onChangeMode={handleChangeMode}
            />
          </div>
        </StaffHeader>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout;
