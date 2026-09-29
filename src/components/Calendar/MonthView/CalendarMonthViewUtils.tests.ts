import { CalendarMonthViewUtils } from './CalendarMonthViewUtils';

// The month grid's columns are headed MON to SUN, so its first cell must be a Monday. It started on the Sunday before
// the 1st, which put every day one column to the right of its heading (Tuesday 29 September 2026 under WED).

describe('CalendarMonthViewUtils.findFirstDateFor', () => {
  it('starts the grid on the Monday on or before the 1st, to match the MON–SUN headings', () => {
    // 1 September 2026 is a Tuesday, so the grid starts on Monday 31 August.
    const [firstDate] = CalendarMonthViewUtils.findFirstDateFor(new Date(2026, 8, 15));

    expect([firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), firstDate.getDay()]).toEqual([2026, 7, 31, 1]);
  });

  it('starts on the 1st itself when the month begins on a Monday', () => {
    // 1 June 2026 is a Monday.
    const [firstDate] = CalendarMonthViewUtils.findFirstDateFor(new Date(2026, 5, 20));

    expect(firstDate.getDate()).toBe(1);
  });

  it('goes back six days when the month begins on a Sunday', () => {
    // 1 November 2026 is a Sunday, so the grid starts on Monday 26 October.
    const [firstDate] = CalendarMonthViewUtils.findFirstDateFor(new Date(2026, 10, 10));

    expect([firstDate.getMonth(), firstDate.getDate()]).toEqual([9, 26]);
  });
});
