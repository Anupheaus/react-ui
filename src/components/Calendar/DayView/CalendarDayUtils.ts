function getOffset(date: Date, hourHeight: number, startHour: number) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  return Math.round((hours * hourHeight) + (mins * (hourHeight / 60)) - (startHour * hourHeight));
}

function getEffectiveHourRange(
  entries: readonly { startDate: Date; endDate?: Date }[],
  rawStartHour?: number,
  rawEndHour?: number,
): { startHour: number; endHour: number } {
  const providedStartHour = rawStartHour == null ? 0 : Math.between(rawStartHour, 0, 23);
  const providedEndHour = rawEndHour == null ? 24 : Math.between(rawEndHour, 1, 24);

  if (entries.length === 0) return { startHour: providedStartHour, endHour: providedEndHour };

  const earliestAppointmentHour = entries.map(entry => entry.startDate.getHours()).min();
  let lastAppointmentHour = entries
    .map(entry => (entry.endDate?.getHours() ?? 0) + ((entry.endDate?.getMinutes() ?? 0) > 0 ? 1 : 0))
    .max();
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
