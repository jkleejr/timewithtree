import { useRef } from "react";

/**
 * Lightweight touch swipe handler for image galleries.
 * Returns handlers to spread onto a container element.
 * Triggers onSwipeLeft for a right-to-left swipe (next),
 * onSwipeRight for a left-to-right swipe (prev).
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 40,
) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (startX.current == null || startY.current == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      startX.current = null;
      startY.current = null;
      // Ignore mostly-vertical gestures so page scroll isn't hijacked.
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    },
  };
}
