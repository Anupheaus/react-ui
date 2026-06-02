import type { CalendarEntryRecord } from '../CalendarModels';

export interface DayViewEntryLayoutSegment {
  entry: CalendarEntryRecord;
  segmentStart: Date;
  segmentEnd: Date;
  leftPercent: number;
  widthPercent: number;
}

interface PositionedEntry {
  entry: CalendarEntryRecord;
  column: number;
}

function getEventEnd(entry: CalendarEntryRecord): Date {
  return entry.endDate ?? entry.startDate;
}

export function clipEntryToDay(
  entry: CalendarEntryRecord,
  startOfDay: Date,
  endOfDay: Date,
): CalendarEntryRecord | null {
  const rawEnd = getEventEnd(entry);
  if (entry.startDate.getTime() >= endOfDay.getTime() || rawEnd.getTime() <= startOfDay.getTime()) {
    return null;
  }

  const segmentStart = entry.startDate.getTime() < startOfDay.getTime() ? startOfDay : entry.startDate;
  const segmentEnd = rawEnd.getTime() > endOfDay.getTime() ? endOfDay : rawEnd;
  if (segmentEnd.getTime() <= segmentStart.getTime()) return null;

  return {
    ...entry,
    startDate: segmentStart,
    endDate: segmentEnd,
  };
}

function eventsOverlap(first: CalendarEntryRecord, second: CalendarEntryRecord): boolean {
  return first.startDate.getTime() < getEventEnd(second).getTime()
    && second.startDate.getTime() < getEventEnd(first).getTime();
}

function compareEntriesForLayout(first: CalendarEntryRecord, second: CalendarEntryRecord): number {
  const startDiff = first.startDate.getTime() - second.startDate.getTime();
  if (startDiff !== 0) return startDiff;
  return getEventEnd(second).getTime() - getEventEnd(first).getTime();
}

function assignColumns(entries: readonly CalendarEntryRecord[]): PositionedEntry[] {
  const sortedEntries = [...entries].sort(compareEntriesForLayout);
  const columnEndTimes: Date[] = [];

  return sortedEntries.map(entry => {
    const eventEnd = getEventEnd(entry);
    let column = columnEndTimes.findIndex(columnEnd => columnEnd.getTime() <= entry.startDate.getTime());
    if (column === -1) {
      column = columnEndTimes.length;
      columnEndTimes.push(eventEnd);
    } else {
      columnEndTimes[column] = eventEnd;
    }
    return { entry, column };
  });
}

function getOverlapColumnCount(positionedEntry: PositionedEntry, positionedEntries: PositionedEntry[]): number {
  const overlapping = positionedEntries.filter(other =>
    other.entry.id !== positionedEntry.entry.id && eventsOverlap(other.entry, positionedEntry.entry),
  );
  if (overlapping.length === 0) return 1;
  return Math.max(positionedEntry.column, ...overlapping.map(other => other.column)) + 1;
}

export function layoutDayViewEntries(entries: readonly CalendarEntryRecord[]): DayViewEntryLayoutSegment[] {
  const positionedEntries = assignColumns(entries);

  return positionedEntries.map(positionedEntry => {
    const columnCount = getOverlapColumnCount(positionedEntry, positionedEntries);
    const segmentEnd = getEventEnd(positionedEntry.entry);

    return {
      entry: positionedEntry.entry,
      segmentStart: positionedEntry.entry.startDate,
      segmentEnd,
      leftPercent: Math.round((positionedEntry.column / columnCount) * 10000) / 100,
      widthPercent: Math.round((100 / columnCount) * 100) / 100,
    };
  });
}

export const calendarDayViewLayout = {
  clipEntryToDay,
  layoutDayViewEntries,
  eventsOverlap,
  getEventEnd,
};
