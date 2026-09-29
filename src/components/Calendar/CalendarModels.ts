import type { ReactNode } from 'react';
import type { IconName } from '../Icon';

/**
 * Renders extra content in a day's header — a badge, a count, a small button.
 *
 * Called once per visible day in every view, with that day's date. Return `undefined` for a day that needs
 * nothing, so days without an adornment are not given an empty element to lay out.
 */
export type CalendarDayAdornmentRenderer = (date: Date) => ReactNode;

export type CalendarWeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DEFAULT_CALENDAR_WEEK_DAYS: readonly CalendarWeekDay[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

export interface CalendarEntryRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  isAllDay?: boolean;
  isBusy?: boolean;
  title?: ReactNode;
  /**
   * A one-line summary for the month view, where a chip is a single 19px line (e.g. "09:30 Mrs Smith"). The chip shows
   * it on one line, cut short with an ellipsis, and hovering shows the full `title`. Falls back to `title`. The day
   * and week views always show `title`.
   */
  monthTitle?: ReactNode;
  description?: ReactNode;
  color?: string;
  icon?: IconName;
}
