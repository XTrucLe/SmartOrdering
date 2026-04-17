"use client";

import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";

function ShiftButton() {
  const [isOnShift, setIsOnShift] = useState(false);
  const [startShift, setStartShift] = useState<string | null>(null);

  // load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("startShift");

    if (saved) {
      setIsOnShift(true);
      setStartShift(saved);
    }
  }, []);

  const handleToggleShift = () => {
    if (isOnShift) {
      localStorage.removeItem("startShift");
      setIsOnShift(false);
      setStartShift(null);
    } else {
      const now = new Date().toISOString();
      localStorage.setItem("startShift", now);
      setIsOnShift(true);
      setStartShift(now);
    }
  };

  //timmer
  useEffect(() => {
    if (isOnShift) {
      const timer = setInterval(() => {
        setStartShift((prev) => prev);
      }, 60000);

      return () => clearInterval(timer);
    }
  }, [isOnShift]);

  return (
    <div className="flex items-center flex-row-reverse gap-2">
      <Button
        onClick={handleToggleShift}
        variant={isOnShift ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {isOnShift ? <LogOut size={16} /> : <LogIn size={16} />}

        {isOnShift ? "Ra ca" : "Vào ca"}
      </Button>
      {isOnShift && startShift && (
        <span className=" flex gap-1 text-sm  items-center text-success border border-success rounded px-2 py-1">
          <Clock size={16} className="inline-block mr-1" />
          {Math.floor(
            (new Date().getTime() - new Date(startShift).getTime()) / 60000,
          )}{" "}
          phút
        </span>
      )}
    </div>
  );
}

export default ShiftButton;
