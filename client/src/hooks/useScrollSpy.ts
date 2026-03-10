import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offset: number = 0) {
  const [activeId, setActiveId] = useState(ids[0] || "");

  useEffect(() => {
    const handleScroll = () => {
      let closestId = ids[0];
      let closestDistance = Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = Math.abs(el.getBoundingClientRect().top - offset);

        if (top < closestDistance) {
          closestDistance = top;
          closestId = id;
        }
      }

      setActiveId(closestId);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ids, offset]);

  return activeId;
}
