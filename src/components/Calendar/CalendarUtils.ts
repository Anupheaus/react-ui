import { CalendarEntryRecord } from './CalendarModels';

function startOfDay(date: Date) {
  const newDate = new Date(date.getTime());
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

const endOf = (date: Date) => { const newDate = new Date(date.getTime()); newDate.setHours(23, 59, 59, 999); return newDate; };
const dayInMs = 1000 * 60 * 60 * 24;

function isOnSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

function isBetween(date: Date, startDate: Date, endDate: Date): boolean {
  return date.getTime() >= startOfDay(startDate).getTime() && date.getTime() <= endOf(endDate).getTime();
}

function daysInBetween(date1: Date, date2: Date): number {
  return Math.floor((startOfDay(date2).getTime() - startOfDay(date1).getTime()) / dayInMs);
}

function getEntriesForDate(entries: readonly CalendarEntryRecord[], date: Date): CalendarEntryRecord[] {
  return entries.filter(({ startDate }) => isOnSameDay(startDate, date));
}

export const CalendarUtils = {
  startOfDay,
  isOnSameDay,
  isBetween,
  daysInBetween,
  getEntriesForDate,
};
