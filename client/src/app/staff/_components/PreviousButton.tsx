"use client";

import { usePathname, useRouter } from "next/navigation";

export const PreviousButton = ({
  prevPath,
  className,
}: {
  prevPath?: string;
  className?: string;
}) => {
  const path = usePathname();
  const router = useRouter();

  const handleGoBack = () => {
    const segments = path.split("/").filter(Boolean);

    router.push(prevPath ?? `/${segments.slice(0, -1).join("/")}`);
  };
  return (
    <button
      onClick={handleGoBack}
      className={`group flex items-center py-1 text-slate-500 hover:text-blue-600 transition-all ring-0 hover:ring-0 outline-none ${className}`}
    >
      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </div>
      <span className="font-semibold text-sm mr-2">Quay lại</span>
    </button>
  );
};
