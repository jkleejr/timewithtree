import { useEffect, useRef } from "react";

/**
 * Lets a horizontally scrollable container respond to vertical mouse-wheel
 * input by scrolling sideways. Trackpad horizontal gestures keep working natively.
 */
export function useHorizontalWheelScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      // Let native horizontal scrolling handle trackpad side-swipes.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const before = el.scrollLeft;
      el.scrollLeft = before + dy;
      if (el.scrollLeft !== before) e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return ref;
}
