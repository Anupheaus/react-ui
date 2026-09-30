import type { WindowFitSize } from './fitWindowToContent';

/**
 * Where a window sits (left/top, relative to its windows host) and how big it is. Numbers are px; a string (e.g. a
 * percentage) is a CSS value left for the browser to resolve. A part not yet known is undefined.
 */
export interface WindowPlacement {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function capSize(size: number | string | undefined, available: number): number | string | undefined {
  if (typeof size !== 'number') return size;
  return Math.min(size, available);
}

/**
 * A window's minimum width or height, capped at the host's so a large minimum (which CSS lets win over `max-width` /
 * `max-height: 100%`) cannot push the window past the space it sits in. Unchanged while the host is not yet measured
 * (or not laid out), and for CSS string values.
 */
export function capMinSizeToHost(minSize: number | string, available: number | undefined): number | string {
  if (available == null || available <= 0 || typeof minSize !== 'number') return minSize;
  return Math.min(minSize, available);
}

function keepEdgeInside(position: number | string | undefined, size: number | string | undefined, available: number): number | string | undefined {
  if (typeof position !== 'number') return position;
  const knownSize = typeof size === 'number' ? size : 0;
  return clamp(position, 0, available - knownSize);
}

/**
 * The placement a window opens at so it is wholly inside the space it sits in (its windows host): no bigger than the
 * host, and moved (never resized further) so that its title bar and its bottom action bar are both on screen. Used
 * when a window opens, for its default size and for a size or position remembered from an earlier session (which may
 * have been on a bigger or another monitor).
 *
 * Parts given as strings, or not yet known, are returned untouched. An unmeasured host (0 × 0, e.g. before layout)
 * leaves the placement as it is rather than squashing the window to nothing.
 */
export function keepWindowInsideHost(placement: WindowPlacement, host: WindowFitSize): WindowPlacement {
  if (host.width <= 0 || host.height <= 0) return placement;
  const width = capSize(placement.width, host.width);
  const height = capSize(placement.height, host.height);
  return {
    x: keepEdgeInside(placement.x, width, host.width),
    y: keepEdgeInside(placement.y, height, host.height),
    width,
    height,
  };
}
