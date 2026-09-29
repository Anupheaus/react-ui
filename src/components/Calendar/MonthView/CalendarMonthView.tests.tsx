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

// A month chip is 19px tall. An entry's full title (a card with a name, an address, notes) cropped to that showed a
// random slice of text, so an entry can give the month view a one-line summary instead (sc-677).

describe('CalendarMonthView — chips', () => {
  const at = (day: number, hour: number) => new Date(2026, 8, day, hour);
  const aCard = (id: string, day: number) => ({
    id, startDate: at(day, 9), endDate: at(day, 10),
    title: <div>{`Full card ${id}`}</div>,
    monthTitle: `09:00 Summary ${id}`,
  });

  it('shows the one-line month summary, not the full title', () => {
    const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[aCard('a', 15)]} />);

    const chip = container.querySelector('calendar-month-cell-entry') as HTMLElement;
    expect(chip.textContent).toBe('09:00 Summary a');
  });

  it('falls back to the title when an entry has no month summary', () => {
    const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[{ id: 'b', startDate: at(15, 9), title: 'Just a title' }]} />);

    expect((container.querySelector('calendar-month-cell-entry') as HTMLElement).textContent).toBe('Just a title');
  });

  it('starts the chips below the date row', () => {
    const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[aCard('a', 15)]} />);

    const chip = container.querySelector('calendar-month-cell-entry') as HTMLElement;
    expect(parseFloat(chip.style.top)).toBeGreaterThanOrEqual(24);
  });

  it("puts each of a day's entries on a row of its own", () => {
    const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[aCard('a', 15), aCard('b', 15)]} />);

    const tops = Array.from(container.querySelectorAll<HTMLElement>('calendar-month-cell-entry')).map(chip => chip.style.top);
    expect(new Set(tops).size).toBe(2);
  });

  it('says "+N more" on a day with more chips than fit', () => {
    const busyDay = ['a', 'b', 'c', 'd', 'e'].map(id => aCard(id, 15));
    const { container, getByText } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={busyDay} />);

    expect(container.querySelectorAll('calendar-month-cell-entry')).toHaveLength(2);
    expect(getByText('+3 more')).toBeTruthy();
  });
});
