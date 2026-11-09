function getOffset(date: Date, hourHeight: number, startHour: number) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  return Math.round((hours * hourHeight) + (mins * (hourHeight / 60)) - (startHour * hourHeight));
}

type RangeEntry = { startDate: Date; endDate?: Date };

/**
 * The parts of `entries` the hour range must cover. An entry that stays inside one day counts as it always did,
 * whichever day is shown. An entry that runs past midnight counts only for the part that falls on each of `days`
 * (so the part after midnight reaches 00:00, and the evening part reaches the end of the day); on a day it does
 * not touch it counts for nothing. With no `days` given the whole entry counts.
 */
function getRangeSegments(entries: readonly RangeEntry[], days?: readonly Date[]): { startHour: number; endHour: number }[] {
  const segments: { startHour: number; endHour: number }[] = [];
  const toEndHour = (date: Date) => date.getHours() + (date.getMinutes() > 0 ? 1 : 0);
  for (const entry of entries) {
    const end = entry.endDate ?? entry.startDate;
    const endOfStartDay = new Date(entry.startDate.getFullYear(), entry.startDate.getMonth(), entry.startDate.getDate(), 23, 59, 59, 999);
    const crossesMidnight = days != null && end.getTime() > endOfStartDay.getTime();
    if (!crossesMidnight) {
      segments.push({ startHour: entry.startDate.getHours(), endHour: entry.endDate == null ? 0 : toEndHour(entry.endDate) });
      continue;
    }
    for (const day of days) {
      const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      if (entry.startDate.getTime() > endOfDay.getTime() || end.getTime() <= startOfDay.getTime()) continue;
      const segmentStart = entry.startDate.getTime() < startOfDay.getTime() ? startOfDay : entry.startDate;
      const segmentEnd = end.getTime() > endOfDay.getTime() ? endOfDay : end;
      segments.push({ startHour: segmentStart.getHours(), endHour: toEndHour(segmentEnd) });
    }
  }
  return segments;
}

function getEffectiveHourRange(
  entries: readonly RangeEntry[],
  rawStartHour?: number,
  rawEndHour?: number,
  days?: readonly Date[],
): { startHour: number; endHour: number } {
  const providedStartHour = rawStartHour == null ? 0 : Math.between(rawStartHour, 0, 23);
  const providedEndHour = rawEndHour == null ? 24 : Math.between(rawEndHour, 1, 24);

  const segments = getRangeSegments(entries, days);
  if (segments.length === 0) return { startHour: providedStartHour, endHour: providedEndHour };

  const earliestAppointmentHour = segments.map(segment => segment.startHour).min();
  let lastAppointmentHour = segments.map(segment => segment.endHour).max();
  if (lastAppointmentHour > 24) lastAppointmentHour = 24;

  return {
    startHour: (rawStartHour == null || earliestAppointmentHour < providedStartHour) ? earliestAppointmentHour : providedStartHour,
    endHour: (rawEndHour == null || lastAppointmentHour > providedEndHour) ? lastAppointmentHour : providedEndHour,
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * The pixel Y offset for the current-time line on the given day, or `null` when it should not be
 * shown — i.e. `now` is not on `date`, or the current time falls outside the visible hour range.
 */
function getNowLineOffset(now: Date, date: Date, hourHeight: number, startHour: number, endHour: number): number | null {
  if (!isSameDay(now, date)) return null;
  const offset = getOffset(now, hourHeight, startHour);
  if (offset < 0 || offset > (endHour - startHour) * hourHeight) return null;
  return offset;
}

export const calendarDayUtils = {
  getOffset,
  getEffectiveHourRange,
  getNowLineOffset,
};
