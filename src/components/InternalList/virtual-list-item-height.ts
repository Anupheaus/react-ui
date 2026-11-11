/** A row height the list uses until it can measure real rows. */
export const VIRTUAL_LIST_ITEM_HEIGHT_FALLBACK = 18;

/** A measure within this fraction of the current height is the window's mix of rows, not a new row height. */
const HEIGHT_CHANGE_TOLERANCE = 0.1;
/** How many times the height may change before it is held, so measures can never flip it for ever. */
const MAX_HEIGHT_CHANGES = 3;

const ROW_SELECTOR = 'table-row, list-item, list-item-with-sub-items';

interface ResolveVirtualListItemHeightProps {
  /** What the rendered rows measure now. */
  measuredHeight: number;
  /** The height the list is using. */
  currentHeight: number;
  /** How many times the measures have changed the height since the list's items last changed. */
  changeCount: number;
}

/**
 * The height of a row in the virtual list: the average of every rendered row. Rows whose text wraps differ in height, so
 * the first row alone would give a different answer for each window of rows, and each answer moves the window.
 */
export function measureVirtualListItemHeight(scrollerContainer: HTMLDivElement): number | undefined {
  const scrollerContent = scrollerContainer.querySelector('scroller-content');
  if (scrollerContent == null) return undefined;
  const rows = Array.from(scrollerContent.querySelectorAll(ROW_SELECTOR));
  if (rows.length === 0) return undefined;
  const totalHeight = rows.reduce((total, row) => total + row.getBoundingClientRect().height, 0);
  const averageHeight = Math.ceil(totalHeight / rows.length);
  return averageHeight > 0 ? averageHeight : undefined;
}

/**
 * The height the list should use after a measure. Measuring a window of unequal rows gives a slightly different answer
 * each time the window moves, and a new height moves the window, so a small difference is ignored and the number of
 * changes is capped: the height settles instead of re-rendering without end ("Maximum update depth exceeded").
 */
export function resolveVirtualListItemHeight({ measuredHeight, currentHeight, changeCount }: ResolveVirtualListItemHeightProps): number {
  const normalizedHeight = Math.max(VIRTUAL_LIST_ITEM_HEIGHT_FALLBACK, measuredHeight);
  if (normalizedHeight === currentHeight) return currentHeight;
  if (changeCount >= MAX_HEIGHT_CHANGES) return currentHeight;
  // The fallback is a guess, not a measure of real rows, so the first measure replaces it whatever the difference.
  if (currentHeight === VIRTUAL_LIST_ITEM_HEIGHT_FALLBACK) return normalizedHeight;
  const isSmallDifference = currentHeight > 0 && Math.abs(normalizedHeight - currentHeight) / currentHeight <= HEIGHT_CHANGE_TOLERANCE;
  return isSmallDifference ? currentHeight : normalizedHeight;
}
