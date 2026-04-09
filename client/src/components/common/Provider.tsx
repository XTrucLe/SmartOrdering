import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SidebarProvider } from "../ui/sidebar";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </TooltipProvider>
  );
}
