/** A width and height, in px. */
export interface WindowFitSize {
  width: number;
  height: number;
}

/** How far the window's content runs past its scroller, in px; negative when the content is shorter than it. */
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
  /** The height it opened at, which it never shrinks below. */
  openedHeight: number;
  /**
   * The window is at a height this fit gave it, so it may give that growth back. Otherwise it only ever grows: a window
   * whose content fills it (a full-height list, which has no height of its own) is never shrunk to that content.
   */
  canShrink: boolean;
}

export interface WindowFit extends WindowFitSize {
  /** Where the window sits, centred in the space. */
  x: number;
  y: number;
}

/**
 * The size a window takes so its content fits: taller when the content grows (capped at the space it sits in, beyond
 * which it scrolls after all), shorter again when content it grew for goes — never below the height it opened at —
 * and wide enough that it never scrolls sideways (it does not get narrower again). Centred in the space. Undefined when
 * it already fits.
 */
export function fitWindowToContent({ window, overflow, space, openedHeight, canShrink }: WindowFitRequest): WindowFit | undefined {
  const width = Math.min(window.width + Math.max(overflow.x, 0), Math.max(space.width, window.width));
  const heightChange = canShrink ? overflow.y : Math.max(overflow.y, 0);
  const height = Math.min(Math.max(window.height + heightChange, openedHeight), Math.max(space.height, window.height));
  if (width === window.width && height === window.height) return;
  return { width, height, x: Math.round((space.width - width) / 2), y: Math.round((space.height - height) / 2) };
}
