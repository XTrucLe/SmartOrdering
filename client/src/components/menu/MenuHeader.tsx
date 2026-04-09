"use client";

import { CurrentTime } from "@/components/common/CurrentTime";
import { Store, UtensilsCrossed } from "lucide-react";
import { Menu } from "@/types";
import { cn } from "@/lib/utils";

export function MenuHeader({ menu }: { menu: Menu }) {
  const badgeBase =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm uppercase tracking-wider font-bold text-[10px]";

  return (
    <header className="relative overflow-hidden border-b bg-background">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 pb-8 pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={cn(
                  badgeBase,
                  "bg-primary/10 text-primary border-primary/20",
                )}
              >
                <UtensilsCrossed className="h-3 w-3" />
                {menu.type === "MAIN" ? "Thực đơn chính" : "Thực đơn đặc biệt"}
              </div>

              <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

              <div
                className={cn(
                  badgeBase,
                  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                )}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Đang mở
              </div>

              <div
                className={cn(
                  badgeBase,
                  "bg-muted text-muted-foreground border-border lowercase first-letter:uppercase",
                )}
              >
                <Store className="h-3 w-3" />
                07:00 - 22:00
              </div>
            </div>

            <div className="max-w-3xl">
              <h1
                className={cn(
                  "mb-3 text-3xl font-extrabold tracking-tight text-foreground",
                  "md:text-5xl lg:text-6xl",
                )}
              >
                {menu.name}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-lg">
                {menu.description}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "hidden border-l border-border pl-8 md:block",
              "animate-in fade-in slide-in-from-right-4 duration-700",
            )}
          >
            <div className="text-right">
              <CurrentTime />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
