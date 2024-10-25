import { createComponent } from '../Component';
import { Tag } from '../Tag';
import type { CalendarEntryRecord } from './CalendarModels';
import { CalendarMonthView } from './MonthView';
import { CalendarEntrySelectionProvider } from './CalendarEntrySelectionProvider';
import { CalendarEntryHighlightProvider } from './CalenderEntryHighlightProvider';
import { createStyles } from '../../theme';
import { CalendarDayView } from './DayView';
import type { ReactNode } from 'react';

const useStyles = createStyles({
  calendar: {
    display: 'flex',
    flex: 'auto',
    maxHeight: '100%',
    maxWidth: '100%',
  },
});

interface DayViewProps {
  view: 'day';
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
}

interface MonthViewProps {
  view?: 'month';
}

type Props = (DayViewProps | MonthViewProps) & {
  label?: ReactNode;
  className?: string;
  viewingDate?: Date;
  entries?: readonly CalendarEntryRecord[];
  onSelect?(entry: CalendarEntryRecord): void;
};

export const Calendar = createComponent('Calendar', ({
  className,
  view = 'month',
  viewingDate = new Date(),
  entries = Array.empty<CalendarEntryRecord>(),
  onSelect = Function.empty(),
  ...props
}: Props) => {
  const { css, join } = useStyles();

  const renderedView = (() => {
    switch (view) {
      case 'month': return <CalendarMonthView entries={entries} viewingDate={viewingDate} />;
      case 'day': return <CalendarDayView {...props} entries={entries} viewingDate={viewingDate} onSelect={onSelect} />;
    }
  })();

  return (
    <CalendarEntryHighlightProvider>
      <CalendarEntrySelectionProvider>
        <Tag name="calendar" className={join(css.calendar, className)}>
          {renderedView}
        </Tag>
      </CalendarEntrySelectionProvider>
    </CalendarEntryHighlightProvider>
  );
});
