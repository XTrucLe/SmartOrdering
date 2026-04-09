import { useState } from "react";

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return currentTime;
}
