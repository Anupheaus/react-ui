import { anuxPureFC } from '../../anuxComponents';
import { Theme, ThemesProvider } from '../../providers/ThemeProvider';
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
  theme?: typeof CalendarTheme;
}

export const Calendar = anuxPureFC<Props>('Calendar', ({
  view = 'month',
  viewingDate: rawDate = new Date(),
  entries = Array.empty(),
  theme,
}) => {
  const { classes, join } = useTheme(theme);
  const viewingDate = CalendarUtils.startOfDay(rawDate);

  const renderedView = (() => {
    switch (view) {
      case 'month': return <CalendarMonthView entries={entries} viewingDate={viewingDate} />;
    }
  })();

  return (
    <ThemesProvider themes={[theme]}>
      <CalendarEntryHighlightProvider>
        <CalendarEntrySelectionProvider>
          <Tag name="calendar" className={join(classes.calendar, classes.theme)}>
            {renderedView}
          </Tag>
        </CalendarEntrySelectionProvider>
      </CalendarEntryHighlightProvider>
    </ThemesProvider>
  );
});

const useTheme = Theme.createThemeUsing(CalendarTheme, styles => ({
  calendar: {
  },
}));
