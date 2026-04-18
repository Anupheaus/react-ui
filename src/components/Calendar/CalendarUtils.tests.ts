import { CalendarUtils } from './CalendarUtils';
import type { CalendarEntryRecord } from './CalendarModels';

describe('CalendarUtils.startOfDay', () => {
  it('zeroes hours, minutes, seconds and milliseconds', () => {
    const d = new Date(2024, 5, 15, 13, 45, 30, 500);
    const result = CalendarUtils.startOfDay(d);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('preserves year, month, and day', () => {
    const d = new Date(2024, 5, 15, 13, 0, 0);
    const result = CalendarUtils.startOfDay(d);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it('does not mutate the input', () => {
    const d = new Date(2024, 5, 15, 13, 45, 30, 500);
    const original = d.getTime();
    CalendarUtils.startOfDay(d);
    expect(d.getTime()).toBe(original);
  });
});

describe('CalendarUtils.isOnSameDay', () => {
  it('returns true for two dates on the same calendar day with different times', () => {
    const a = new Date(2024, 5, 15, 9, 0, 0);
    const b = new Date(2024, 5, 15, 23, 59, 59);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(true);
  });

  it('returns false when days differ', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 5, 16);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(false);
  });

  it('returns false when months differ', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 6, 15);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(false);
  });

  it('returns false when years differ', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(false);
  });
});

describe('CalendarUtils.isBetween', () => {
  const start = new Date(2024, 5, 10);
  const end = new Date(2024, 5, 20);

  it('returns true when date is on the start day', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 10, 8, 0), start, end)).toBe(true);
  });

  it('returns true when date is on the end day', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 20, 23, 0), start, end)).toBe(true);
  });

  it('returns true when date is strictly between start and end', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 15), start, end)).toBe(true);
  });

  it('returns false when date is before start', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 9), start, end)).toBe(false);
  });

  it('returns false when date is after end', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 21), start, end)).toBe(false);
  });
});

describe('CalendarUtils.daysInBetween', () => {
  it('returns 0 for the same day', () => {
    const d = new Date(2024, 5, 15);
    expect(CalendarUtils.daysInBetween(d, d)).toBe(0);
  });

  it('returns 1 for consecutive days', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 5, 16);
    expect(CalendarUtils.daysInBetween(a, b)).toBe(1);
  });

  it('returns correct count for a multi-day range', () => {
    const a = new Date(2024, 5, 1);
    const b = new Date(2024, 5, 10);
    expect(CalendarUtils.daysInBetween(a, b)).toBe(9);
  });

  it('ignores time of day when computing days', () => {
    const a = new Date(2024, 5, 15, 23, 59, 59);
    const b = new Date(2024, 5, 16, 0, 0, 1);
    expect(CalendarUtils.daysInBetween(a, b)).toBe(1);
  });
});

describe('CalendarUtils.getEntriesForDate', () => {
  const makeEntry = (date: Date, id: string): CalendarEntryRecord => ({
    id,
    startDate: date,
    endDate: date,
    title: `Entry ${id}`,
  });

  it('returns empty array when entries list is empty', () => {
    expect(CalendarUtils.getEntriesForDate([], new Date(2024, 5, 15))).toEqual([]);
  });

  it('returns entries whose startDate is on the given day', () => {
    const target = new Date(2024, 5, 15);
    const entry = makeEntry(new Date(2024, 5, 15, 10, 30), 'a');
    expect(CalendarUtils.getEntriesForDate([entry], target)).toEqual([entry]);
  });

  it('excludes entries on different days', () => {
    const target = new Date(2024, 5, 15);
    const other = makeEntry(new Date(2024, 5, 16), 'b');
    expect(CalendarUtils.getEntriesForDate([other], target)).toEqual([]);
  });

  it('returns multiple entries when more than one fall on the same day', () => {
    const target = new Date(2024, 5, 15);
    const a = makeEntry(new Date(2024, 5, 15, 9, 0), 'a');
    const b = makeEntry(new Date(2024, 5, 15, 14, 0), 'b');
    const c = makeEntry(new Date(2024, 5, 16), 'c');
    expect(CalendarUtils.getEntriesForDate([a, b, c], target)).toEqual([a, b]);
  });
});
