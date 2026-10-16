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
  /**
   * The size the window is drawn at, in px, when known. Only read to keep the window's edges inside when its width or
   * height is a CSS string, which the browser resolves (a '75%' window held at its min-width can be wider than 75%).
   */
  drawn?: Partial<WindowFitSize>;
}

/** The gap, in px, left between a window pulled back inside its host and the host's edge, so its shadow and corners show. */
const PULLED_BACK_EDGE_GAP = 16;

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

interface EdgeRequest {
  position: number | string | undefined;
  /** The window's size along this axis: px, or a CSS string (e.g. '75%'). */
  size: number | string | undefined;
  /** The size the window is drawn at along this axis, in px, when known: it stands in for a CSS string size. */
  drawnSize: number | undefined;
  available: number;
}

function keepEdgeInside({ position, size, drawnSize, available }: EdgeRequest): number | string | undefined {
  if (typeof position !== 'number') return position;
  // A CSS size (a percentage held back by a min-width) is as wide as it is drawn, not nothing: counted as 0, a window
  // remembered at x=227 on a 1920 screen reopened at x=227 on a 1366 one and ran 200px off its right edge (Vision sc-3365).
  const knownSize = typeof size === 'number' ? size : Math.min(drawnSize ?? 0, available);
  const furthest = available - knownSize;
  if (position >= 0 && position <= furthest) return position;
  // Pulled back: clear of the edge when there is room for the gap on both sides, flush when there is not.
  const gap = furthest >= PULLED_BACK_EDGE_GAP * 2 ? PULLED_BACK_EDGE_GAP : 0;
  return clamp(position, gap, furthest - gap);
}

/**
 * The placement a window opens at so it is wholly inside the space it sits in (its windows host): no bigger than the
 * host, and moved (never resized further) so that its title bar and its bottom action bar are both on screen. A window
 * that had to be moved is left a 16px gap from the edge it came back over, when there is room for it. Used
 * when a window opens, for its default size and for a size or position remembered from an earlier session (which may
 * have been on a bigger or another monitor).
 *
 * Parts given as strings, or not yet known, are returned untouched; a position is still kept inside by the window's drawn
 * size (`placement.drawn`) when its size is a string. An unmeasured host (0 × 0, e.g. before layout) leaves the placement
 * as it is rather than squashing the window to nothing.
 */
export function keepWindowInsideHost(placement: WindowPlacement, host: WindowFitSize): WindowPlacement {
  if (host.width <= 0 || host.height <= 0) return placement;
  const { x, y, drawn } = placement;
  const width = capSize(placement.width, host.width);
  const height = capSize(placement.height, host.height);
  return {
    x: keepEdgeInside({ position: x, size: width, drawnSize: drawn?.width, available: host.width }),
    y: keepEdgeInside({ position: y, size: height, drawnSize: drawn?.height, available: host.height }),
    width,
    height,
  };
}
