import { useEffect, useRef, type MutableRefObject } from 'react';
import { DateTime } from 'luxon';

const SWIPE_THRESHOLD_PX = 50;
const DIRECTION_LOCK_PX = 4;

type CalendarView = 'day' | 'week' | 'month';

/** True only where touch input exists; swipe navigation is disabled otherwise (e.g. desktop). */
const isTouchEnvironment = typeof window !== 'undefined'
  && (('ontouchstart' in window) || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));

function shiftDate(date: Date, view: CalendarView, amount: number): Date {
  const unit = view === 'day' ? 'days' : view === 'week' ? 'weeks' : 'months';
  return DateTime.fromJSDate(date).plus({ [unit]: amount }).toJSDate();
}

interface CalendarSwipeOptions {
  view: CalendarView;
  viewingDate: Date;
  onViewingDateChange?(date: Date): void;
}

/**
 * Adds horizontal-swipe navigation to the returned element ref, **touch environments only**.
 *
 * A left swipe moves to the next period, a right swipe to the previous; the step matches the
 * current `view` (day → ±1 day, week → ±1 week, month → ±1 month). Uses native non-passive
 * listeners so it can `preventDefault()` horizontal moves and stop the browser's back/forward
 * history gesture; vertical scrolling is untouched. No-ops when `onViewingDateChange` is absent.
 */
export function useCalendarSwipe({ view, viewingDate, onViewingDateChange }: CalendarSwipeOptions): MutableRefObject<HTMLDivElement | null> {
  const elementRef = useRef<HTMLDivElement | null>(null);
  // Hold the latest props so the once-bound listeners always read current values.
  const latest = useRef({ view, viewingDate, onViewingDateChange });
  latest.current = { view, viewingDate, onViewingDateChange };

  useEffect(() => {
    const element = elementRef.current;
    if (element == null || !isTouchEnvironment) return;

    let startX = 0;
    let startY = 0;
    let directionDecided = false;
    let isHorizontal = false;

    const onTouchStart = (event: TouchEvent): void => {
      const touch = event.touches[0];
      if (touch == null) return;
      startX = touch.clientX;
      startY = touch.clientY;
      directionDecided = false;
      isHorizontal = false;
    };

    const onTouchMove = (event: TouchEvent): void => {
      if (latest.current.onViewingDateChange == null) return;
      const touch = event.touches[0];
      if (touch == null) return;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      if (!directionDecided) {
        if (Math.abs(deltaX) < DIRECTION_LOCK_PX && Math.abs(deltaY) < DIRECTION_LOCK_PX) return;
        isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        directionDecided = true;
      }
      // Claim horizontal swipes so the browser doesn't run its history (back/forward) gesture.
      if (isHorizontal) event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent): void => {
      if (!isHorizontal) return;
      const { onViewingDateChange: onChange, view: currentView, viewingDate: currentDate } = latest.current;
      if (onChange == null) return;
      const touch = event.changedTouches[0];
      if (touch == null) return;
      const deltaX = touch.clientX - startX;
      if (deltaX <= -SWIPE_THRESHOLD_PX) onChange(shiftDate(currentDate, currentView, 1));
      else if (deltaX >= SWIPE_THRESHOLD_PX) onChange(shiftDate(currentDate, currentView, -1));
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return elementRef;
}
