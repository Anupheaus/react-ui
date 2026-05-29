import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { createStory } from '../../Storybook/createStory';
import { Calendar } from './Calendar';
import type { CalendarEntryRecord } from './CalendarModels';
import { DateTime } from 'luxon';
import type { IconName } from '../Icon';
import { UIState } from '../../providers';

type TypedCalendarEntryRecord = Omit<CalendarEntryRecord, 'icon'> & { icon?: IconName };

function toCalendarEntries(entries: TypedCalendarEntryRecord[]): CalendarEntryRecord[] {
  return entries as CalendarEntryRecord[];
}

const VIEWING_DATE = DateTime.fromISO('2025-06-10').toJSDate();
const VIEWING_DAY = '2025-06-10';

const monthViewEntries = toCalendarEntries([
  { id: 'm1', title: 'Tony on Holiday', startDate: DateTime.fromISO('2025-06-02').toJSDate(), endDate: DateTime.fromISO('2025-06-08').toJSDate(), color: '#9ADDFB', icon: 'calendar-holiday' },
  { id: 'm2', title: 'Jodie at Business Conference', startDate: DateTime.fromISO('2025-06-05').toJSDate(), endDate: DateTime.fromISO('2025-06-14').toJSDate(), color: '#99D5CF', icon: 'calendar-business' },
  { id: 'm3', title: 'Harrison on Sick Leave', startDate: DateTime.fromISO('2025-05-28').toJSDate(), endDate: DateTime.fromISO('2025-06-03').toJSDate(), color: '#FDE69C', icon: 'calendar-sick' },
  { id: 'm4', title: 'Lucas on Holiday', startDate: DateTime.fromISO('2025-06-12').toJSDate(), endDate: DateTime.fromISO('2025-06-15').toJSDate(), color: '#C2B0E2', icon: 'calendar-holiday' },
  { id: 'm5', title: 'Hayden on Paternity Leave', startDate: DateTime.fromISO('2025-06-09').toJSDate(), endDate: DateTime.fromISO('2025-06-11').toJSDate(), color: '#FDBCA7', icon: 'calendar-paternity' },
]);

const busyMonthViewEntries = toCalendarEntries([
  ...monthViewEntries,
  { id: 'm6', title: 'Quarterly Review', startDate: DateTime.fromISO('2025-06-10').toJSDate(), color: '#B8E986', icon: 'calendar-business' },
  { id: 'm7', title: 'Team Lunch', startDate: DateTime.fromISO('2025-06-10').toJSDate(), color: '#FFD3A5', icon: 'calendar-business' },
  { id: 'm8', title: 'Product Demo', startDate: DateTime.fromISO('2025-06-10').toJSDate(), color: '#A8E6CF', icon: 'calendar-business' },
  { id: 'm9', title: 'Board Meeting', startDate: DateTime.fromISO('2025-06-17').toJSDate(), color: '#FFAAA5', icon: 'calendar-business' },
  { id: 'm10', title: 'Training Day', startDate: DateTime.fromISO('2025-06-24').toJSDate(), endDate: DateTime.fromISO('2025-06-25').toJSDate(), color: '#D4A5FF', icon: 'calendar-business' },
]);

function dayEntry(
  id: string,
  title: string | undefined,
  startTime: string,
  endTime: string,
  color: string,
): TypedCalendarEntryRecord {
  return {
    id,
    title,
    startDate: DateTime.fromISO(`${VIEWING_DAY}T${startTime}`).toJSDate(),
    endDate: DateTime.fromISO(`${VIEWING_DAY}T${endTime}`).toJSDate(),
    color,
    icon: 'calendar-business',
  };
}

const dayViewEntries = toCalendarEntries([
  dayEntry('d1', 'Team Stand-up', '09:00:00', '09:30:00', '#9ADDFB'),
  dayEntry('d2', 'Client Call', '10:00:00', '11:00:00', '#99D5CF'),
  dayEntry('d3', 'Design Review', '14:00:00', '15:30:00', '#C2B0E2'),
  dayEntry('d4', '1:1 with Manager', '16:00:00', '16:30:00', '#FDBCA7'),
]);

const overlappingDayViewEntries = toCalendarEntries([
  dayEntry('o1', 'Team Stand-up', '09:00:00', '09:30:00', '#9ADDFB'),
  dayEntry('o2', 'Client Call', '10:00:00', '11:00:00', '#99D5CF'),
  dayEntry('o3', 'Overlapping Workshop', '10:30:00', '11:30:00', '#FDE69C'),
  dayEntry('o4', 'Quick Sync', '10:45:00', '11:15:00', '#FFD3A5'),
  dayEntry('o5', 'Afternoon Focus Block', '13:00:00', '17:00:00', '#C2B0E2'),
]);

const monthViewLoadingTitleEntries = toCalendarEntries([
  { id: 'l1', startDate: DateTime.fromISO('2025-06-02').toJSDate(), endDate: DateTime.fromISO('2025-06-08').toJSDate(), color: '#9ADDFB', icon: 'calendar-holiday' },
  { id: 'l2', title: '', startDate: DateTime.fromISO('2025-06-05').toJSDate(), endDate: DateTime.fromISO('2025-06-14').toJSDate(), color: '#99D5CF', icon: 'calendar-business' },
  { id: 'l3', startDate: DateTime.fromISO('2025-06-10').toJSDate(), color: '#FDE69C', icon: 'calendar-business' },
  { id: 'l4', title: '', startDate: DateTime.fromISO('2025-06-12').toJSDate(), endDate: DateTime.fromISO('2025-06-15').toJSDate(), color: '#C2B0E2', icon: 'calendar-holiday' },
]);

const dayViewLoadingTitleEntries = toCalendarEntries([
  dayEntry('l1', undefined, '09:00:00', '09:30:00', '#9ADDFB'),
  dayEntry('l2', '', '10:00:00', '11:00:00', '#99D5CF'),
  dayEntry('l3', undefined, '14:00:00', '15:30:00', '#C2B0E2'),
  dayEntry('l4', '', '16:00:00', '16:30:00', '#FDBCA7'),
]);

const meta: Meta<typeof Calendar> = {
  component: Calendar,
};
export default meta;

type Story = StoryObj<typeof Calendar>;

const waitForStoryReady = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
};

export const MonthViewDefault: Story = createStory({
  width: 720,
  height: 480,
  render: () => (
    <Calendar
      label="June 2025"
      entries={monthViewEntries}
      viewingDate={VIEWING_DATE}
    />
  ),
});
MonthViewDefault.name = 'Month View — Default';

export const MonthViewEmpty: Story = createStory({
  width: 720,
  height: 480,
  render: () => (
    <Calendar
      label="June 2025"
      entries={[]}
      viewingDate={VIEWING_DATE}
    />
  ),
});
MonthViewEmpty.name = 'Month View — Empty';

export const MonthViewBusyDay: Story = createStory({
  width: 720,
  height: 480,
  render: () => (
    <Calendar
      label="June 2025 — Busy Day"
      entries={busyMonthViewEntries}
      viewingDate={VIEWING_DATE}
    />
  ),
});
MonthViewBusyDay.name = 'Month View — Busy Day';

export const DayViewDefault: Story = createStory({
  width: 420,
  height: 640,
  render: () => (
    <Calendar
      label="Tuesday 10 June"
      view="day"
      entries={dayViewEntries}
      viewingDate={VIEWING_DATE}
      onSelect={fn()}
    />
  ),
});
DayViewDefault.name = 'Day View — Default';
DayViewDefault.play = waitForStoryReady;

export const DayViewOverlappingEntries: Story = createStory({
  width: 420,
  height: 640,
  render: () => (
    <Calendar
      label="Tuesday 10 June — Overlaps"
      view="day"
      entries={overlappingDayViewEntries}
      viewingDate={VIEWING_DATE}
      onSelect={fn()}
    />
  ),
});
DayViewOverlappingEntries.name = 'Day View — Overlapping Entries';
DayViewOverlappingEntries.play = waitForStoryReady;

export const DayViewEmpty: Story = createStory({
  width: 420,
  height: 640,
  render: () => (
    <Calendar
      label="Tuesday 10 June"
      view="day"
      entries={[]}
      viewingDate={VIEWING_DATE}
      startHour={8}
      endHour={18}
      onSelect={fn()}
    />
  ),
});
DayViewEmpty.name = 'Day View — Empty';
DayViewEmpty.play = waitForStoryReady;

export const DayViewCustomHours: Story = createStory({
  width: 420,
  height: 640,
  render: () => (
    <Calendar
      label="Tuesday 10 June — 8am to 6pm"
      view="day"
      entries={dayViewEntries}
      viewingDate={VIEWING_DATE}
      startHour={8}
      endHour={18}
      hourHeight={80}
      onSelect={fn()}
    />
  ),
});
DayViewCustomHours.name = 'Day View — Custom Hours';
DayViewCustomHours.play = waitForStoryReady;

export const MonthViewLoadingEmptyTitles: Story = createStory({
  width: 720,
  height: 480,
  render: () => (
    <UIState isLoading>
      <Calendar
        label="June 2025 — loading titles"
        entries={monthViewLoadingTitleEntries}
        viewingDate={VIEWING_DATE}
      />
    </UIState>
  ),
});
MonthViewLoadingEmptyTitles.name = 'Month View — Loading Empty Titles';
MonthViewLoadingEmptyTitles.play = waitForStoryReady;

export const DayViewLoadingEmptyTitles: Story = createStory({
  width: 420,
  height: 640,
  render: () => (
    <UIState isLoading>
      <Calendar
        label="Tuesday 10 June — loading titles"
        view="day"
        entries={dayViewLoadingTitleEntries}
        viewingDate={VIEWING_DATE}
        startHour={8}
        endHour={18}
        onSelect={fn()}
      />
    </UIState>
  ),
});
DayViewLoadingEmptyTitles.name = 'Day View — Loading Empty Titles';
DayViewLoadingEmptyTitles.play = waitForStoryReady;

const monthViewUIStatesConfig = {
  args: {
    label: 'June 2025',
    viewingDate: VIEWING_DATE,
  },
  width: 720,
  height: 480,
  render: (props: React.ComponentProps<typeof Calendar>) => (
    <Calendar {...props} entries={monthViewEntries} />
  ),
} satisfies Story;

export const MonthViewUIStates: Story = createStorybookComponentStates(monthViewUIStatesConfig) as Story;
MonthViewUIStates.name = 'Month View — UI States';
MonthViewUIStates.play = waitForStoryReady;

const dayViewUIStatesConfig = {
  args: {
    label: 'Tuesday 10 June',
    view: 'day' as const,
    viewingDate: VIEWING_DATE,
    startHour: 8,
    endHour: 18,
    onSelect: fn(),
  },
  width: 420,
  height: 640,
  render: (props: React.ComponentProps<typeof Calendar>) => (
    <Calendar {...props} entries={dayViewEntries} />
  ),
} satisfies Story;

export const DayViewUIStates: Story = createStorybookComponentStates(dayViewUIStatesConfig) as Story;
DayViewUIStates.name = 'Day View — UI States';
DayViewUIStates.play = waitForStoryReady;
