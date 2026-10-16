import type { ReactNode } from 'react';
import type { IconName } from '../Icon';

/**
 * What a day's count button shows (`Calendar`'s `getDayCount`). The calendar draws the button and places it per view;
 * what is being counted is the consumer's business.
 */
export interface CalendarDayCount {
  /** How many. A day with none (0 or less) shows no button at all. */
  count: number;
  /** `alert` draws the button in the theme's error colour: something on that day needs attention. Defaults to `normal`. */
  tone?: 'normal' | 'alert';
  /** Said on hover and keyboard focus, and the button's accessible name, so say what the number counts ("You have 3 tasks due on this day"). */
  tooltip?: string;
}

/**
 * The count for a day, or `undefined` for a day with nothing to show. Called once per visible day in every view; the
 * function must change identity whenever what it counts changes, or the counts are not redrawn.
 */
export type CalendarDayCountGetter = (date: Date) => CalendarDayCount | undefined;

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
