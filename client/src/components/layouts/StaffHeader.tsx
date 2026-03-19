import { SearchBox } from "../common/Search";

interface StaffHeaderProps {
  children?: React.ReactNode;
  query?: string;
  setQuery?: (value: string) => void;
}

function StaffHeader({ children, query, setQuery }: StaffHeaderProps) {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b border-border bg-sidebar px-6 ">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">POS System</h1>
        {children}
      </div>
      <div className="flex flex-1 justify-center px-10">
        <div className="w-full max-w-md">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Tìm nhanh..."
            shortcut="F2"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Nhân viên A</p>
          <p className="text-xs text-muted-foreground">Ca sáng</p>
        </div>

        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>
    </header>
  );
}

export default StaffHeader;
