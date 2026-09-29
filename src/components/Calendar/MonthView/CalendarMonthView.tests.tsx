import { render } from '@testing-library/react';
import { Calendar } from '../Calendar';

// The month grid fills the width it is given: as a row flex item it used to size to its content, leaving an empty
// strip down the right of a wide calendar window (sc-675). Its seven columns share that width equally.

const VIEWING_DATE = new Date(2026, 8, 15);

describe('CalendarMonthView — width', () => {
  it('takes the full width of the calendar', () => {
    const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[]} />);

    const grid = container.querySelector('calendar-month-view') as HTMLElement;
    expect(getComputedStyle(grid).width).toBe('100%');
  });

  it('takes the full width of the calendar when it has a label', () => {
    const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[]} label="September 2026" />);

    const grid = container.querySelector('calendar-month-view') as HTMLElement;
    const shell = container.querySelector('calendar-month-view-root') as HTMLElement;
    expect([getComputedStyle(shell).width, getComputedStyle(grid).width]).toEqual(['100%', '100%']);
  });
});
