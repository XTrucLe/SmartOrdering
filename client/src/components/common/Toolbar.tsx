import { cn } from "@/lib/utils";

interface ToolbarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const Toolbar = ({ left, center, right, className }: ToolbarProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-center px-4 py-2 border-b bg-popover/40 shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-2">{left}</div>

      <div className="flex items-center justify-center gap-2">{center}</div>

      <div className="flex items-center justify-end gap-2">{right}</div>
    </div>
  );
};
