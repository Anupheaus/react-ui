import { createContext } from 'react';
import type { CalendarDayCountGetter } from './CalendarModels';

/** What the calendar's day-count button needs, supplied once by `Calendar` so every view reads the same one. */
export interface CalendarDayCountContextValue {
  getDayCount?: CalendarDayCountGetter;
  onDayCountSelect?(date: Date): void;
}

export const CalendarDayCountContext = createContext<CalendarDayCountContextValue>({});
