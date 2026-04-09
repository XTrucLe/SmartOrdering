import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function CheckoutActions() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-9 mt-2">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="w-1/3 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 -ml-2" />
        Quay lại
      </Button>

      <Button className="w-3/5" size="lg">
        Đặt món
      </Button>
    </div>
  );
}
