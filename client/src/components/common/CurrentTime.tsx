"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time)
    return <div className="h-5 w-20 bg-slate-100 rounded animate-pulse" />;

  const timeString = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(time);

  const dateString = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(time);

  const hour = time.getHours();
  let greeting = "Xin chào";
  if (hour < 11) greeting = "Chào buổi sáng";
  else if (hour < 14) greeting = "Buổi trưa vui vẻ";
  else if (hour < 18) greeting = "Chào buổi chiều";
  else greeting = "Buổi tối ấm áp";

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5 text-slate-800 font-bold text-lg leading-none">
        <Clock className="w-4 h-4 text-slate-500" />
        <span>{timeString}</span>
      </div>

      <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 capitalize text-right">
        {dateString} • {greeting}
      </div>
    </div>
  );
}
