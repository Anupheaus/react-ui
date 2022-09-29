import { pureFC } from '../../anuxComponents';
import { Tag } from '../Tag';
import { CalendarEntryRecord } from './CalendarModels';
import { CalendarMonthView } from './MonthView';
import { CalendarTheme } from './CalendarTheme';
import { CalendarUtils } from './CalendarUtils';
import { CalendarEntrySelectionProvider } from './CalendarEntrySelectionProvider';
import { CalendarEntryHighlightProvider } from './CalenderEntryHighlightProvider';

interface Props {
  view?: 'month';
  viewingDate?: Date;
  entries?: CalendarEntryRecord[];
}

export const Calendar = pureFC<Props>()('Calendar', CalendarTheme, () => ({
  calendar: {
  },
}), ({
  view = 'month',
  viewingDate: rawDate = new Date(),
  entries = Array.empty(),
  theme: {
    css,
  },
}) => {
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
});
