import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { CalendarEntryRecord } from './CalendarModels';
import { CalendarMonthView } from './MonthView';
import { CalendarUtils } from './CalendarUtils';
import { CalendarEntrySelectionProvider } from './CalendarEntrySelectionProvider';
import { CalendarEntryHighlightProvider } from './CalenderEntryHighlightProvider';

interface Props {
  view?: 'month';
  viewingDate?: Date;
  entries?: readonly CalendarEntryRecord[];
}

export const Calendar = createComponent({
  id: 'Calendar',

  styles: () => ({
    styles: {
      calendar: {},
    },
  }),

  render: ({
    view = 'month',
    viewingDate: rawDate = new Date(),
    entries = Array.empty<CalendarEntryRecord>(),
  }: Props, { css }) => {
    const viewingDate = CalendarUtils.startOfDay(rawDate);

    const renderedView = (() => {
      switch (view) {
        case 'month': return <CalendarMonthView entries={entries} viewingDate={viewingDate} />;
      }
    })();

    return (
      <CalendarEntryHighlightProvider>
        <CalendarEntrySelectionProvider>
          <Tag name="calendar" className={css.calendar}>
            {renderedView}
          </Tag>
        </CalendarEntrySelectionProvider>
      </CalendarEntryHighlightProvider>
    );
  },
});
