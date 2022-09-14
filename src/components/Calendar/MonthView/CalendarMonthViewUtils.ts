import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { CalendarEntryRecord } from '../CalendarModels';
import { CalendarUtils } from '../CalendarUtils';
import { CalendarMonthEntryRecord } from './CalendarMonthViewModels';

function createMonthEntries(entries: readonly CalendarEntryRecord[], firstDate: Date, lastDate: Date) /*: CalendarMonthEntryRecord[]*/ {
  return useMemo(() => {
    const relevantEntries = entries
      .filter(({ startDate, endDate }) => startDate <= lastDate && (endDate === undefined ? startDate >= firstDate : endDate >= firstDate))
      .orderBy(({ startDate }) => startDate.getTime())
      .map((entry): CalendarMonthEntryRecord => ({ entry, renderedOnRow: 0 }));
    for (let dayIndex = 0; dayIndex < CalendarUtils.daysInBetween(firstDate, lastDate); dayIndex++) {
      const currentDate = DateTime.fromJSDate(firstDate).plus({ days: dayIndex }).toJSDate();
      const validEntriesForToday = relevantEntries.filter(({ entry: { startDate, endDate } }) => CalendarUtils.isBetween(currentDate, startDate, endDate === undefined ? startDate : endDate));
      const usedRows = validEntriesForToday.map(({ renderedOnRow }) => renderedOnRow === 0 ? undefined : renderedOnRow).removeNull();
      validEntriesForToday.forEach(monthEntry => {
        if (monthEntry.renderedOnRow !== 0) return;
        for (let row = 1; row <= validEntriesForToday.length + 1; row++) {
          if (usedRows.includes(row)) continue;
          monthEntry.renderedOnRow = row;
          break;
        }
      });
    }
    return relevantEntries;
  }, [entries]);
}

function findFirstDateFor(date: Date): [Date, Date] {
  const firstOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDay = firstOfTheMonth.getDay();
  const firstDate = DateTime.fromJSDate(firstOfTheMonth).minus({ days: firstDay }).toJSDate();
  const endDate = DateTime.fromJSDate(firstDate).plus({ days: 35 }).toJSDate();
  return [firstDate, endDate];
}

function getEntriesForDate(entries: CalendarMonthEntryRecord[], date: Date, dayIndex: number): CalendarMonthEntryRecord[] {
  return entries.filter(({ entry: { startDate, endDate = startDate } }) => CalendarUtils.isOnSameDay(startDate, date)
    || (CalendarUtils.isBetween(date, startDate, endDate) && dayIndex === 0));
}

export const CalendarMonthViewUtils = {
  createMonthEntries,
  findFirstDateFor,
  getEntriesForDate,
};