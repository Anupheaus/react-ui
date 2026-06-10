import { describe, it, expect } from 'vitest';
import { shiftViewingDate, getVisibleRange } from './calendarNavigation';

describe('calendarNavigation', () => {
  const date = new Date(2026, 5, 10, 12, 0, 0); // 10 June 2026, local

  it('shiftViewingDate steps by the view unit', () => {
    expect(shiftViewingDate('day', date, 1).getDate()).toBe(11);
    expect(shiftViewingDate('day', date, -1).getDate()).toBe(9);
    expect(shiftViewingDate('week', date, 1).getDate()).toBe(17);
    expect(shiftViewingDate('week', date, -1).getDate()).toBe(3);
    expect(shiftViewingDate('month', date, 1).getMonth()).toBe(6); // July
    expect(shiftViewingDate('month', date, -1).getMonth()).toBe(4); // May
  });

  it('day range without neighbours is just that day', () => {
    const { from, to } = getVisibleRange('day', date, false);
    expect(from.getDate()).toBe(10);
    expect(from.getHours()).toBe(0);
    expect(to.getDate()).toBe(10);
    expect(to.getHours()).toBe(23);
  });

  it('day range with neighbours spans the previous through next day', () => {
    const { from, to } = getVisibleRange('day', date, true);
    expect(from.getDate()).toBe(9);
    expect(from.getHours()).toBe(0);
    expect(to.getDate()).toBe(11);
    expect(to.getHours()).toBe(23);
  });

  it('neighbour ranges fully contain the current period for week and month', () => {
    for (const view of ['week', 'month'] as const) {
      const narrow = getVisibleRange(view, date, false);
      const wide = getVisibleRange(view, date, true);
      expect(wide.from.getTime()).toBeLessThan(narrow.from.getTime());
      expect(wide.to.getTime()).toBeGreaterThan(narrow.to.getTime());
    }
  });
});
