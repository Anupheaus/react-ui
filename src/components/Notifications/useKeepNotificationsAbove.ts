import { useContext, useLayoutEffect, useRef } from 'react';
import { useId } from '../../hooks/useId';
import { NotificationsInsetContext } from './NotificationsInsetContext';

/** How close (px) an element's bottom edge must be to the viewport's bottom to count as docked there. */
const DOCKED_TOLERANCE_PX = 1;

/** How far up from the bottom of the viewport `element` covers, or undefined when it is not docked at the bottom. */
function bottomInsetOf(element: HTMLElement): number | undefined {
  const { top, bottom, height } = element.getBoundingClientRect();
  if (height <= 0 || bottom < window.innerHeight - DOCKED_TOLERANCE_PX) return undefined;
  return Math.max(0, Math.round(window.innerHeight - top));
}

/**
 * Keeps toasts clear of an element docked at the bottom of the screen — e.g. a mobile navigation bar — for as long as
 * it is mounted and `isEnabled`. Re-measures when the element or the window changes size (rotation, resize). Attach the
 * returned ref to the element.
 */
export function useKeepNotificationsAbove<T extends HTMLElement>(isEnabled: boolean) {
  const { setBottomInset } = useContext(NotificationsInsetContext);
  const id = useId();
  const elementRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!isEnabled || element == null) return;
    const measure = () => setBottomInset(id, bottomInsetOf(element));
    measure();
    window.addEventListener('resize', measure);
    // ResizeObserver catches the bar itself changing height (safe-area padding, a label wrapping); absent in old runtimes.
    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    resizeObserver?.observe(element);
    return () => {
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
      setBottomInset(id, undefined);
    };
  }, [isEnabled, id, setBottomInset]);

  return elementRef;
}
