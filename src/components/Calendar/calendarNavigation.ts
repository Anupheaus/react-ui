import { DateTime } from 'luxon';
import { CalendarMonthViewUtils } from './MonthView/CalendarMonthViewUtils';

export type CalendarView = 'day' | 'week' | 'month';

/** True only where touch input exists; the swipe carousel is enabled only in touch environments. */
export const isTouchEnvironment = typeof window !== 'undefined'
  && (('ontouchstart' in window) || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));

/** Move a date by `amount` periods of the given view (±days/weeks/months). */
export function shiftViewingDate(view: CalendarView, date: Date, amount: number): Date {
  const dt = DateTime.fromJSDate(date);
  if (view === 'day') return dt.plus({ days: amount }).toJSDate();
  if (view === 'week') return dt.plus({ weeks: amount }).toJSDate();
  return dt.plus({ months: amount }).toJSDate();
}

/** Inclusive start/end of the period containing `date` for the given view. */
function periodBounds(view: CalendarView, date: Date): { from: Date; to: Date } {
  if (view === 'month') {
    const [from, to] = CalendarMonthViewUtils.findFirstDateFor(date);
    return { from, to };
  }
  const dt = DateTime.fromJSDate(date);
  if (view === 'week') return { from: dt.startOf('week').toJSDate(), to: dt.endOf('week').toJSDate() };
  return { from: dt.startOf('day').toJSDate(), to: dt.endOf('day').toJSDate() };
}

/**
 * Date range covering the visible period. When `includeNeighbours` is true the range also spans
 * the previous and next periods — the data a swipe carousel needs to render prev/current/next.
 */
export function getVisibleRange(view: CalendarView, date: Date, includeNeighbours: boolean): { from: Date; to: Date } {
  if (!includeNeighbours) return periodBounds(view, date);
  const prev = periodBounds(view, shiftViewingDate(view, date, -1));
  const next = periodBounds(view, shiftViewingDate(view, date, 1));
  return { from: prev.from, to: next.to };
}
