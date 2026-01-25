import { CurrentTime } from "@/components/common/current-timer";
import { Store, UtensilsCrossed } from "lucide-react";
import { Menu } from "../../_types";

export function MenuHeader({ menu }: { menu: Menu }) {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto p-5 pb-8 pt-6">
        <div className="bg-background border-b border-border relative overflow-hidden">
          <div className="max-w-7xl mx-auto p-5 pb-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                  bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider
                  shadow-sm border border-primary/20"
                  >
                    <UtensilsCrossed className="w-3 h-3" />
                    {menu.type === "MAIN"
                      ? "Thực đơn chính"
                      : "Thực đơn đặc biệt"}
                  </div>

                  <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-success/10 text-success border border-success/20"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      Đang mở
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-muted text-muted-foreground border border-border"
                  >
                    <Store className="w-3 h-3" />
                    <span className="text-[11px] font-medium">
                      07:00 - 22:00
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
                    {menu.name}
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-2xl">
                    {menu.description}
                  </p>
                </div>
              </div>

              <div className="hidden md:block pl-6 border-l border-border">
                <CurrentTime />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
