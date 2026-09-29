import { RefObject, useEffect, useState } from 'react';

/**
 * Whether the element is currently on screen. Used to pause auto-playing carousels and
 * animations while they are scrolled out of view, so they don't keep the main thread busy.
 */
export function useIsVisible(ref: RefObject<Element | null>): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
