import { calendarDayUtils } from './CalendarDayUtils';

describe('calendarDayUtils.getEffectiveHourRange across midnight', () => {
  const evening = new Date(2026, 9, 19, 23, 0); // 19 Oct 23:00
  const afterMidnight = new Date(2026, 9, 20, 1, 0); // 20 Oct 01:00
  const entry = { startDate: evening, endDate: afterMidnight };
  const day19 = new Date(2026, 9, 19);
  const day20 = new Date(2026, 9, 20);
  const day21 = new Date(2026, 9, 21);

  it('shows the whole of the next day from 00:00 to the end, even when 08-18 is the hint', () => {
    expect(calendarDayUtils.getEffectiveHourRange([entry], 8, 18, [day20])).toEqual({ startHour: 0, endHour: 18 });
  });

  it('shows from the start to the end of the day on the day it starts', () => {
    expect(calendarDayUtils.getEffectiveHourRange([entry], 8, 18, [day19])).toEqual({ startHour: 8, endHour: 24 });
  });

  it('ignores a crossing visit on a day it does not touch', () => {
    expect(calendarDayUtils.getEffectiveHourRange([entry], 8, 18, [day21])).toEqual({ startHour: 8, endHour: 18 });
  });

  it('covers every day of a week with the union of the parts on those days', () => {
    expect(calendarDayUtils.getEffectiveHourRange([entry], 8, 18, [day19, day20, day21])).toEqual({ startHour: 0, endHour: 24 });
  });

  it('treats a visit ending exactly at midnight as running to the end of its day', () => {
    const toMidnight = { startDate: new Date(2026, 9, 19, 22, 0), endDate: new Date(2026, 9, 20, 0, 0) };
    expect(calendarDayUtils.getEffectiveHourRange([toMidnight], 8, 18, [day19])).toEqual({ startHour: 8, endHour: 24 });
    expect(calendarDayUtils.getEffectiveHourRange([toMidnight], 8, 18, [day20])).toEqual({ startHour: 8, endHour: 18 });
  });

  it('draws visits that stay inside one day exactly as before, whichever day is shown', () => {
    const morning = { startDate: new Date(2026, 9, 19, 6, 30), endDate: new Date(2026, 9, 19, 7, 30) };
    const late = { startDate: new Date(2026, 9, 21, 19, 0), endDate: new Date(2026, 9, 21, 20, 15) };
    expect(calendarDayUtils.getEffectiveHourRange([morning, late], 8, 18, [day20])).toEqual({ startHour: 6, endHour: 21 });
    expect(calendarDayUtils.getEffectiveHourRange([morning, late], 8, 18)).toEqual({ startHour: 6, endHour: 21 });
  });

  it('keeps the old behaviour when no days are given and nothing crosses midnight', () => {
    expect(calendarDayUtils.getEffectiveHourRange([], 8, 18, [day20])).toEqual({ startHour: 8, endHour: 18 });
  });
});

describe('calendarDayUtils.getNowLineOffset', () => {
  const hourHeight = 60;
  const startHour = 8;
  const endHour = 18;
  const day = new Date(2026, 8, 16); // 16 Sep 2026

  it('returns the pixel offset when now is on the given day and within the hour range', () => {
    const now = new Date(2026, 8, 16, 9, 30);
    // 9h30 from midnight, minus the 8h start = 1h30 into the grid = 90px at 60px/hour.
    expect(calendarDayUtils.getNowLineOffset(now, day, hourHeight, startHour, endHour)).toBe(90);
  });

  it('returns null when now is on a different day', () => {
    const now = new Date(2026, 8, 17, 9, 30);
    expect(calendarDayUtils.getNowLineOffset(now, day, hourHeight, startHour, endHour)).toBeNull();
  });

  it('returns null when the current time is before the visible start hour', () => {
    const now = new Date(2026, 8, 16, 7, 0);
    expect(calendarDayUtils.getNowLineOffset(now, day, hourHeight, startHour, endHour)).toBeNull();
  });

  it('returns null when the current time is after the visible end hour', () => {
    const now = new Date(2026, 8, 16, 18, 30);
    expect(calendarDayUtils.getNowLineOffset(now, day, hourHeight, startHour, endHour)).toBeNull();
  });
});
