"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/auth.store";
import { StatusColor } from "@/features/stores/constants/StatusColor";
import {
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  StoreIcon,
} from "lucide-react";
import { Store } from "@/features/stores/types/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function SelectStorePage() {
  const router = useRouter();
  const { accessibleStores: stores, setStore } = useAuthStore();

  const handleSelectedStore = (store: Store) => {
    if (store.status !== "ACTIVE") {
      return;
    }
    setStore(store);
    router.push(`${store.role}/dashboard`);
  };

  if (!stores || stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <StoreIcon className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          No Accessible Stores
        </h2>
        <p className="text-muted-foreground max-w-100 mt-2 mb-6">
          You haven't been assigned to any stores yet. Please contact your
          administrator to get access.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-10 px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Select Store
          </h1>
          <p className="text-muted-foreground">
            Choose a location to start managing your business.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onClick={() => handleSelectedStore(store)}
          />
        ))}
      </div>
    </div>
  );
}

const StoreCard = ({
  store,
  onClick,
}: {
  store: Store;
  onClick: () => void;
}) => {
  const storeAddress = `${store.streetAddress}, ${store.ward}, ${store.province}`;

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-primary/20 border-muted-foreground/20 w-100">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Store Identity */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                {store.name}
              </h2>
              <span className="text-xs font-mono text-muted-foreground/70 shrink-0">
                /{store.slug}
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md border shadow-sm transition-all",
              // Tạo background nhạt dựa trên status
              store.status === "ACTIVE" && "bg-success/10 border-success/20",
              store.status === "PENDING" && "bg-pending/10 border-pending/20",
              store.status === "REJECTED" &&
                "bg-destructive/10 border-destructive/20",
              store.status === "SUSPENDED" && "bg-warning/10 border-warning/20",
            )}
          >
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-tight",
                store.status === "ACTIVE"
                  ? "text-success"
                  : "text-muted-foreground",
              )}
            >
              {store.status}
            </span>
            <div
              className={cn(
                "w-2 h-2 rounded-full shadow-inner",
                StatusColor[store.status || "PENDING"],
                store.status === "PENDING" && "animate-pulse",
              )}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 text-sm">
        {store.role && (
          <div className="flex items-center gap-2 text-xs font-semibold bg-secondary text-secondary-foreground w-fit px-2.5 py-1 rounded-full border border-border">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="capitalize tracking-tight">{store.role}</span>
          </div>
        )}

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 text-muted-foreground group/item">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover/item:text-primary transition-colors" />
            <span className="text-foreground leading-snug line-clamp-2">
              {storeAddress}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground group/item">
            <Phone className="w-4 h-4 shrink-0 group-hover/item:text-primary transition-colors" />
            <span className="text-foreground font-medium">{store.phone}</span>
          </div>
        </div>

        {store.description && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 bg-muted/30 p-2 rounded italic">
            {store.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={onClick}
          className={cn(
            "ml-auto",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            store.status !== "ACTIVE" &&
              "cursor-not-allowed opacity-50 hover:bg-primary/90",
          )}
        >
          Manage Store
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SelectStorePage;
