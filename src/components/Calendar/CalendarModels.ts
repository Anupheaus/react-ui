import type { ReactNode } from 'react';
import type { IconName } from '../Icon';

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
  description?: ReactNode;
  color?: string;
  icon?: IconName;
}
