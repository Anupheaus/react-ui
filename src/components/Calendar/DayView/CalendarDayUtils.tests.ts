import { calendarDayUtils } from './CalendarDayUtils';

describe('calendarDayUtils.getOffset', () => {
  const hourHeight = 60; // pixels per hour

  it('returns 0 when date is exactly at startHour:00', () => {
    const date = new Date(2024, 5, 15, 8, 0, 0);
    expect(calendarDayUtils.getOffset(date, hourHeight, 8)).toBe(0);
  });

  it('increases by hourHeight for each hour past startHour', () => {
    const date = new Date(2024, 5, 15, 10, 0, 0);
    // 10:00 with startHour=8 → 2 hours * 60px = 120
    expect(calendarDayUtils.getOffset(date, hourHeight, 8)).toBe(120);
  });

  it('adds fractional offset for minutes (30 mins = half hourHeight)', () => {
    const date = new Date(2024, 5, 15, 8, 30, 0);
    // 0h 30m with hourHeight=60 → 30 * (60/60) = 30px
    expect(calendarDayUtils.getOffset(date, hourHeight, 8)).toBe(30);
  });

  it('subtracts startHour offset correctly', () => {
    const date = new Date(2024, 5, 15, 9, 0, 0);
    // startHour=10 → 9:00 is 1 hour before start → -60
    expect(calendarDayUtils.getOffset(date, hourHeight, 10)).toBe(-60);
  });

  it('works with hourHeight other than 60', () => {
    const date = new Date(2024, 5, 15, 9, 0, 0);
    // startHour=8, hourHeight=100 → 1 hour * 100 = 100
    expect(calendarDayUtils.getOffset(date, 100, 8)).toBe(100);
  });
});
