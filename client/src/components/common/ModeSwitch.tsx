import { cn } from "@/lib/utils";
import { Mode } from "@/types/ui/ModeSwitch.type";

export const TopBar = ({
  modes,
  activeMode,
  onChangeMode,
}: {
  modes: Mode[];
  activeMode?: string;
  onChangeMode: (mode: Mode) => void;
}) => {
  return (
    <div
      className="grid p-1 border border-border rounded-md shadow-sm bg-popover"
      style={{ gridTemplateColumns: `repeat(${modes.length}, minmax(0, 1fr))` }}
    >
      {modes.map((mode) => {
        const isActive = mode.value === activeMode;

        return (
          <button
            key={mode.value}
            onClick={() => onChangeMode(mode)}
            className={cn(
              "flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              "transition-colors duration-400",
              !isActive && "text-muted-foreground hover:text-foreground",
              isActive && "bg-primary/95 text-primary-foreground shadow-sm",
            )}
          >
            {mode.icon}
            <span className="capitalize">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
