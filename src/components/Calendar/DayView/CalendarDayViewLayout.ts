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

function getSegmentBreakpoints(entry: CalendarEntryRecord, positionedEntries: PositionedEntry[]): number[] {
  const eventStart = entry.startDate.getTime();
  const eventEnd = getEventEnd(entry).getTime();
  const breakpoints = new Set<number>([eventStart, eventEnd]);

  for (const positionedEntry of positionedEntries) {
    if (!eventsOverlap(positionedEntry.entry, entry)) continue;
    const otherStart = positionedEntry.entry.startDate.getTime();
    const otherEnd = getEventEnd(positionedEntry.entry).getTime();
    if (otherStart > eventStart && otherStart < eventEnd) breakpoints.add(otherStart);
    if (otherEnd > eventStart && otherEnd < eventEnd) breakpoints.add(otherEnd);
  }

  return [...breakpoints].sort((first, second) => first - second);
}

function layoutSegment(
  positionedEntry: PositionedEntry,
  segmentStart: number,
  segmentEnd: number,
  activeInSegment: PositionedEntry[],
): DayViewEntryLayoutSegment {
  const sortedActive = [...activeInSegment].sort((first, second) => first.column - second.column);
  const columnCount = sortedActive.length;
  const displayIndex = sortedActive.findIndex(activeEntry => activeEntry.entry.id === positionedEntry.entry.id);

  return {
    entry: positionedEntry.entry,
    segmentStart: new Date(segmentStart),
    segmentEnd: new Date(segmentEnd),
    leftPercent: Math.round((displayIndex / columnCount) * 10000) / 100,
    widthPercent: Math.round((100 / columnCount) * 100) / 100,
  };
}

export function layoutDayViewEntries(entries: readonly CalendarEntryRecord[]): DayViewEntryLayoutSegment[] {
  const positionedEntries = assignColumns(entries);
  const segments: DayViewEntryLayoutSegment[] = [];

  for (const positionedEntry of positionedEntries) {
    const breakpoints = getSegmentBreakpoints(positionedEntry.entry, positionedEntries);

    for (let breakpointIndex = 0; breakpointIndex < breakpoints.length - 1; breakpointIndex += 1) {
      const segmentStart = breakpoints[breakpointIndex];
      const segmentEnd = breakpoints[breakpointIndex + 1];
      if (segmentEnd <= segmentStart) continue;

      const activeInSegment = positionedEntries.filter(other => {
        const otherStart = other.entry.startDate.getTime();
        const otherEnd = getEventEnd(other.entry).getTime();
        return otherStart < segmentEnd && otherEnd > segmentStart;
      });

      segments.push(layoutSegment(positionedEntry, segmentStart, segmentEnd, activeInSegment));
    }
  }

  return segments;
}

export const calendarDayViewLayout = {
  clipEntryToDay,
  layoutDayViewEntries,
  eventsOverlap,
  getEventEnd,
};
