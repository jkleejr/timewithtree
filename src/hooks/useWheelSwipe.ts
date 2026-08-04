import { useEffect, useRef } from "react";

/**
 * Adds horizontal wheel / trackpad swipe navigation to a carousel.
 * Returns a ref to attach to the carousel container.
 */
export function useWheelSwipe(onNext: () => void, onPrev: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  const handlers = useRef({ onNext, onPrev });
  handlers.current = { onNext, onPrev };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let accumulated = 0;
    let locked = false;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    const THRESHOLD = 40;

    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);

      // Only intercept clearly horizontal gestures so vertical page scroll still works.
      if (Math.abs(dx) <= Math.abs(dy)) return;

      e.preventDefault();
      if (locked) return;

      accumulated += dx;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulated = 0;
      }, 200);

      if (Math.abs(accumulated) >= THRESHOLD) {
        if (accumulated > 0) handlers.current.onNext();
        else handlers.current.onPrev();
        accumulated = 0;
        locked = true;
        setTimeout(() => {
          locked = false;
        }, 350);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  return ref;
}
