import { useEffect, useState, useRef } from "react";

export function useScrollSpy(
  ids: string[],
  options: {
    offset?: number;
    root?: HTMLElement | null;
    threshold?: number | number[];
  } = {},
) {
  const { offset = 0, root = null, threshold = 0 } = options;
  const [activeId, setActiveId] = useState<string>("");

  const idsRef = useRef(ids);
  // eslint-disable-next-line react-hooks/refs
  idsRef.current = ids;

  useEffect(() => {
    const elements = idsRef.current
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibleElements = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleElements.set(entry.target.id, entry.isIntersecting);
        });

        const firstVisibleId = idsRef.current.find((id) =>
          visibleElements.get(id),
        );

        if (firstVisibleId) {
          setActiveId(firstVisibleId);
        }
      },
      {
        root,
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold,
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [offset, root, threshold]);

  return activeId || ids[0];
}
