import { DateTime } from 'luxon';
import type { CalendarWeekDay } from '../CalendarModels';
import { DEFAULT_CALENDAR_WEEK_DAYS } from '../CalendarModels';

const DAY_OFFSET_FROM_MONDAY: Record<CalendarWeekDay, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

const DAY_LABELS: Record<CalendarWeekDay, string> = {
  mon: 'MON',
  tue: 'TUE',
  wed: 'WED',
  thu: 'THU',
  fri: 'FRI',
  sat: 'SAT',
  sun: 'SUN',
};

export interface CalendarWeekDayDate {
  day: CalendarWeekDay;
  date: Date;
}

function resolveWeekDays(weekDays?: readonly CalendarWeekDay[]): readonly CalendarWeekDay[] {
  if (weekDays == null || weekDays.length === 0) return DEFAULT_CALENDAR_WEEK_DAYS;
  return weekDays;
}

function getMondayOfWeek(viewingDate: Date): Date {
  const weekday = DateTime.fromJSDate(viewingDate).weekday;
  return DateTime.fromJSDate(viewingDate).minus({ days: weekday - 1 }).startOf('day').toJSDate();
}

function getWeekDayDates(viewingDate: Date, weekDays?: readonly CalendarWeekDay[]): CalendarWeekDayDate[] {
  const resolvedWeekDays = resolveWeekDays(weekDays);
  const monday = getMondayOfWeek(viewingDate);

  return resolvedWeekDays.map(day => ({
    day,
    date: DateTime.fromJSDate(monday).plus({ days: DAY_OFFSET_FROM_MONDAY[day] }).toJSDate(),
  }));
}

function getDayLabel(day: CalendarWeekDay): string {
  return DAY_LABELS[day];
}

export const CalendarWeekViewUtils = {
  getWeekDayDates,
  getDayLabel,
  resolveWeekDays,
};
