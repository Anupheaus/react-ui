/** A width and height, in px. */
export interface WindowFitSize {
  width: number;
  height: number;
}

/** How far the window's content runs past its scroller, in px (0 or less when it fits that way). */
export interface WindowContentOverflow {
  x: number;
  y: number;
}

export interface WindowFitRequest {
  /** The window's current size. */
  window: WindowFitSize;
  overflow: WindowContentOverflow;
  /** The space the window sits in (its windows host). */
  space: WindowFitSize;
}

export interface WindowFit extends WindowFitSize {
  /** Where the grown window sits, centred in the space. */
  x: number;
  y: number;
}

/**
 * The size a window grows to so its content no longer scrolls, capped at the space it sits in (beyond which it
 * scrolls after all), and centred there. Undefined when its content already fits and it need not grow. It never
 * shrinks: a window that has grown for bigger content keeps that size rather than jumping about.
 */
export function fitWindowToContent({ window, overflow, space }: WindowFitRequest): WindowFit | undefined {
  const width = Math.min(window.width + Math.max(overflow.x, 0), Math.max(space.width, window.width));
  const height = Math.min(window.height + Math.max(overflow.y, 0), Math.max(space.height, window.height));
  if (width <= window.width && height <= window.height) return;
  return { width, height, x: Math.round((space.width - width) / 2), y: Math.round((space.height - height) / 2) };
}
