import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { Calendar } from './Calendar';
import type { CalendarDayCount } from './CalendarModels';

vi.mock('use-resize-observer/polyfilled.js', () => ({
  default: () => ({ ref: () => undefined, width: undefined, height: undefined }),
}));

// jsdom has no layout, so the week and day views' scroller has nothing to scroll.
beforeAll(() => { Element.prototype.scrollTo = () => undefined; });

// A day's count button: just the number, nothing on a day with none, placed per view (month: far left of the cell's top
// row before the date; week: before the day title; day: after the title), pressing it reports the day, and its tooltip
// (hover or keyboard focus) is also its accessible name.

/** Tuesday 16 September 2026. */
const VIEWING_DATE = new Date(2026, 8, 16);
const TOOLTIP = 'You have 3 tasks due on this day';

const isSameDay = (date: Date, other: Date): boolean => date.toDateString() === other.toDateString();

function threeTasksOnViewingDate(dayCount: Partial<CalendarDayCount> = {}) {
  return (date: Date): CalendarDayCount | undefined => (isSameDay(date, VIEWING_DATE) ? { count: 3, tooltip: TOOLTIP, ...dayCount } : undefined);
}

describe('Calendar day counts', () => {
  describe('month view', () => {
    it('puts the count first in the cell header, with the date after it', () => {
      const { container } = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      const header = screen.getByRole('button').closest('calendar-month-view-cell-date') as HTMLElement;
      const [first, last] = [header.firstElementChild, header.lastElementChild];
      expect(first).toBe(screen.getByRole('button'));
      expect(last?.tagName.toLowerCase()).toBe('calendar-month-view-cell-date-number');
      expect(last?.textContent).toBe('16');
      expect(container.querySelectorAll('calendar-month-view-cell button')).toHaveLength(1);
    });

    it('shows just the number', () => {
      render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      expect(screen.getByRole('button').textContent).toBe('3');
    });
  });

  describe('week view', () => {
    it('puts the count before the day title in the column header', () => {
      render(<Calendar view="week" viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      const header = screen.getByRole('button').closest('calendar-week-view-day-header') as HTMLElement;
      expect(header.firstElementChild).toBe(screen.getByRole('button'));
      expect(header.lastElementChild?.tagName.toLowerCase()).toBe('calendar-week-view-day-title');
      expect(within(header).getByText('16')).toBeInTheDocument();
    });
  });

  describe('day view', () => {
    it('puts the count after the day title, at the far right of the header', () => {
      render(<Calendar view="day" viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      const header = screen.getByRole('button').closest('calendar-day-view-header') as HTMLElement;
      expect(header.firstElementChild?.textContent).toContain('Wednesday 16 September');
      expect(header.lastElementChild).toBe(screen.getByRole('button').closest('calendar-day-view-day-count'));
    });
  });

  describe.each(['month', 'week', 'day'] as const)('in the %s view', view => {
    it('shows nothing on a day with no count, or a count of 0', () => {
      const none = render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={() => undefined} />);
      expect(none.container.querySelectorAll('button')).toHaveLength(0);
      none.unmount();

      const zero = render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={() => ({ count: 0, tooltip: 'None' })} />);
      expect(zero.container.querySelectorAll('button')).toHaveLength(0);
    });

    it('draws nothing when the calendar is given no counts', () => {
      const { container } = render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} />);

      expect(container.querySelectorAll('button')).toHaveLength(0);
    });

    it('is named by its tooltip, not just its number', () => {
      render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      expect(screen.getByRole('button', { name: TOOLTIP })).toBeInTheDocument();
    });

    it('reports the day when it is pressed', () => {
      const onDayCountSelect = vi.fn<(date: Date) => void>();
      render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} onDayCountSelect={onDayCountSelect} />);

      fireEvent.click(screen.getByRole('button', { name: TOOLTIP }));

      expect(onDayCountSelect).toHaveBeenCalledTimes(1);
      expect(isSameDay(onDayCountSelect.mock.calls[0]![0], VIEWING_DATE)).toBe(true);
    });

    it('shows its tooltip on hover', async () => {
      render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      fireEvent.mouseOver(screen.getByRole('button', { name: TOOLTIP }));

      expect(await screen.findByRole('tooltip')).toHaveTextContent(TOOLTIP);
    });

    it('shows its tooltip when it takes keyboard focus', async () => {
      render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);

      // A key press first, so the browser (and MUI) treat the focus that follows as the keyboard's.
      fireEvent.keyDown(document.body, { key: 'Tab' });
      act(() => screen.getByRole('button', { name: TOOLTIP }).focus());

      expect(screen.getByRole('button', { name: TOOLTIP })).toHaveFocus();
      expect(await screen.findByRole('tooltip')).toHaveTextContent(TOOLTIP);
    });

    it('follows a new count function', () => {
      const { rerender } = render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);
      expect(screen.getByRole('button').textContent).toBe('3');

      rerender(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate({ count: 12, tooltip: 'Twelve' })} />);

      expect(screen.getByRole('button', { name: 'Twelve' }).textContent).toBe('12');
    });

    it('fits a count of 99 on the button', () => {
      render(<Calendar view={view} viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate({ count: 99 })} />);

      expect(screen.getByRole('button').textContent).toBe('99');
    });
  });

  it('draws an alert count in a different colour from a normal one', () => {
    const normal = render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate()} />);
    const normalColour = getComputedStyle(screen.getByRole('button')).backgroundColor;
    normal.unmount();

    render(<Calendar view="month" viewingDate={VIEWING_DATE} entries={[]} getDayCount={threeTasksOnViewingDate({ tone: 'alert' })} />);

    expect(getComputedStyle(screen.getByRole('button')).backgroundColor).not.toBe(normalColour);
  });
});
