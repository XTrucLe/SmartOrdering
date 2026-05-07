"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import {
  History,
  Bell,
  UtensilsCrossed,
  Package,
  Settings,
  LogOut,
  List,
} from "lucide-react";
import { site_config } from "@/configs/site";
import { Sidebar } from "@/components/common/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SIDEBAR_ITEMS = [
  {
    value: "orders",
    label: "Bán hàng",
    icon: <List size={20} />,
    tooltip: "Bán hàng",
  },
  {
    value: "queue",
    label: "Đơn hàng",
    icon: <Package size={20} />,
    tooltip: "Tiến độ",
    badge: 5,
  },
  {
    value: "history",
    label: "Lịch sử",
    icon: <History size={20} />,
    tooltip: "Nhật ký",
  },
];

const SIDEBAR_FOOTER = [
  { value: "settings", label: "Cài đặt", icon: <Settings size={20} /> },
  {
    value: "logout",
    label: "Đăng xuất",
    icon: <LogOut size={20} color="var(--error)" />,
    danger: true,
  },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [modal, setModal] = useState(false);

  const activeMode = useMemo(() => {
    const segments = pathname.split("/");
    console.log(segments, segments[segments.length - 1]);

    return segments[segments.length - 1] || "orders";
  }, [pathname]);

  const handleChangeMode = (id: string) => {
    if (id === "logout") {
      setModal(true);
      return;
    }
    router.replace(`/staff/${id}`);
  };

  const handleGoHome = () => {
    router.replace(`/staff/${SIDEBAR_ITEMS[0].value}`);
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="z-50 border-b bg-popover h-16 shrink-0 shadow-inner">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-6 ">
            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={handleGoHome}
            >
              <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-transform group-active:scale-95">
                <UtensilsCrossed size={22} strokeWidth={2.5} />
              </div>
              <div className="hidden md:block">
                <h1 className="font-black leading-none text-sm tracking-tight uppercase">
                  POS System
                </h1>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">
                  v{site_config.version} • {site_config.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-xl transition-colors relative border">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
            </button>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="flex items-center gap-3 pl-2">
              <div className="flex-col items-end hidden sm:flex">
                <p className="text-xs font-black uppercase tracking-tight">
                  Nhân viên A
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                    Trong ca
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-muted border-2 border-border flex items-center justify-center font-black text-sm text-foreground">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          items={SIDEBAR_ITEMS}
          activeId={activeMode}
          isCollapsed={true}
          onSelect={handleChangeMode}
          footer={SIDEBAR_FOOTER}
          className="shadow-xl"
        />

        <main className="flex-1 min-h-0 h-full overflow-hidden">
          <div className="h-full w-full">{children}</div>
        </main>
      </div>
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="z-9999">
          <DialogHeader>
            <DialogTitle>Đăng xuất</DialogTitle>
          </DialogHeader>

          <p>Bạn có chắc chắn muốn đăng xuất không?</p>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setModal(false)}>
              Hủy
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                setModal(false);
                router.replace("/login");
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
