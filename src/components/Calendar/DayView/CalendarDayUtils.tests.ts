import { calendarDayUtils } from './CalendarDayUtils';

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
