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

const WEEK_START = '2025-06-09';

function weekEntry(
  id: string,
  title: string | undefined,
  dayOffset: number,
  startTime: string,
  endTime: string,
  color: string,
): TypedCalendarEntryRecord {
  const day = DateTime.fromISO(WEEK_START).plus({ days: dayOffset }).toISODate();
  return {
    id,
    title,
    startDate: DateTime.fromISO(`${day}T${startTime}`).toJSDate(),
    endDate: DateTime.fromISO(`${day}T${endTime}`).toJSDate(),
    color,
    icon: 'calendar-business',
  };
}

const weekViewEntries = toCalendarEntries([
  weekEntry('w1', 'Planning', 0, '09:00:00', '10:00:00', '#9ADDFB'),
  weekEntry('w2', 'Team Stand-up', 1, '09:00:00', '09:30:00', '#99D5CF'),
  weekEntry('w3', 'Client Call', 1, '10:00:00', '11:00:00', '#C2B0E2'),
  weekEntry('w4', 'Design Review', 2, '14:00:00', '15:30:00', '#FDE69C'),
  weekEntry('w5', 'Workshop', 3, '10:30:00', '12:00:00', '#FFD3A5'),
  weekEntry('w6', 'Demo', 4, '11:00:00', '12:00:00', '#A8E6CF'),
  weekEntry('w7', 'Wrap-up', 6, '16:00:00', '17:00:00', '#FDBCA7'),
]);

const overlappingWeekViewEntries = toCalendarEntries([
  weekEntry('wo1', 'Team Stand-up', 1, '09:00:00', '09:30:00', '#9ADDFB'),
  weekEntry('wo2', 'Client Call', 1, '10:00:00', '11:00:00', '#99D5CF'),
  weekEntry('wo3', 'Overlapping Workshop', 1, '10:30:00', '11:30:00', '#FDE69C'),
  weekEntry('wo4', 'Quick Sync', 1, '10:45:00', '11:15:00', '#FFD3A5'),
  weekEntry('wo5', 'Deep Work Block', 1, '13:00:00', '17:00:00', '#C2B0E2'),
  weekEntry('wo6', 'Friday Demo', 4, '11:00:00', '12:00:00', '#A8E6CF'),
]);

const weekViewLoadingTitleEntries = toCalendarEntries([
  weekEntry('wl1', undefined, 1, '09:00:00', '09:30:00', '#9ADDFB'),
  weekEntry('wl2', '', 1, '10:00:00', '11:00:00', '#99D5CF'),
  weekEntry('wl3', undefined, 2, '14:00:00', '15:30:00', '#C2B0E2'),
  weekEntry('wl4', '', 4, '11:00:00', '12:00:00', '#A8E6CF'),
]);

const meta: Meta<typeof Calendar> = {
  component: Calendar,
};
export default meta;

type Story = StoryObj<typeof Calendar>;

const waitForStoryReady = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
};

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
};

export const DayViewUIStates: Story = createStorybookComponentStates(dayViewUIStatesConfig) as Story;
DayViewUIStates.name = 'Day View — UI States';
DayViewUIStates.play = waitForStoryReady;

export const WeekViewDefault: Story = createStory({
  width: 960,
  height: 640,
  render: () => (
    <Calendar
      label="Week of 9 June 2025"
      view="week"
      entries={weekViewEntries}
      viewingDate={VIEWING_DATE}
      onSelect={fn()}
    />
  ),
});
WeekViewDefault.name = 'Week View — Default';
WeekViewDefault.play = waitForStoryReady;

export const WeekViewWorkWeek: Story = createStory({
  width: 760,
  height: 640,
  render: () => (
    <Calendar
      label="Work week of 9 June 2025"
      view="week"
      weekDays={['mon', 'tue', 'wed', 'thu', 'fri']}
      entries={weekViewEntries}
      viewingDate={VIEWING_DATE}
      onSelect={fn()}
    />
  ),
});
WeekViewWorkWeek.name = 'Week View — Mon to Fri';
WeekViewWorkWeek.play = waitForStoryReady;

export const WeekViewWorkWeekFullHours: Story = createStory({
  width: 760,
  height: 640,
  render: () => (
    <Calendar
      label="Work week of 9 June 2025 — full day"
      view="week"
      weekDays={['mon', 'tue', 'wed', 'thu', 'fri']}
      entries={weekViewEntries}
      viewingDate={VIEWING_DATE}
      startHour={0}
      endHour={24}
      onSelect={fn()}
    />
  ),
});
WeekViewWorkWeekFullHours.name = 'Week View — Work Week Full Hours';
WeekViewWorkWeekFullHours.play = waitForStoryReady;

export const WeekViewEmpty: Story = createStory({
  width: 960,
  height: 640,
  render: () => (
    <Calendar
      label="Week of 9 June 2025"
      view="week"
      entries={[]}
      viewingDate={VIEWING_DATE}
      startHour={8}
      endHour={18}
      onSelect={fn()}
    />
  ),
});
WeekViewEmpty.name = 'Week View — Empty';
WeekViewEmpty.play = waitForStoryReady;

export const WeekViewOverlappingEntries: Story = createStory({
  width: 960,
  height: 640,
  render: () => (
    <Calendar
      label="Week of 9 June 2025 — Overlaps"
      view="week"
      entries={overlappingWeekViewEntries}
      viewingDate={VIEWING_DATE}
      onSelect={fn()}
    />
  ),
});
WeekViewOverlappingEntries.name = 'Week View — Overlapping Entries';
WeekViewOverlappingEntries.play = waitForStoryReady;

export const WeekViewCustomHours: Story = createStory({
  width: 960,
  height: 640,
  render: () => (
    <Calendar
      label="Week of 9 June 2025 — 8am to 6pm"
      view="week"
      entries={weekViewEntries}
      viewingDate={VIEWING_DATE}
      startHour={8}
      endHour={18}
      hourHeight={80}
      onSelect={fn()}
    />
  ),
});
WeekViewCustomHours.name = 'Week View — Custom Hours';
WeekViewCustomHours.play = waitForStoryReady;

export const WeekViewLoadingEmptyTitles: Story = createStory({
  width: 960,
  height: 640,
  render: () => (
    <UIState isLoading>
      <Calendar
        label="Week of 9 June 2025 — loading titles"
        view="week"
        entries={weekViewLoadingTitleEntries}
        viewingDate={VIEWING_DATE}
        onSelect={fn()}
      />
    </UIState>
  ),
});
WeekViewLoadingEmptyTitles.name = 'Week View — Loading Empty Titles';
WeekViewLoadingEmptyTitles.play = waitForStoryReady;

const weekViewUIStatesConfig = {
  args: {
    label: 'Week of 9 June 2025',
    view: 'week' as const,
    viewingDate: VIEWING_DATE,
    onSelect: fn(),
  },
  width: 960,
  height: 640,
  render: (props: React.ComponentProps<typeof Calendar>) => (
    <Calendar {...props} entries={weekViewEntries} />
  ),
};

export const WeekViewUIStates: Story = createStorybookComponentStates(weekViewUIStatesConfig) as Story;
WeekViewUIStates.name = 'Week View — UI States';
WeekViewUIStates.play = waitForStoryReady;

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
};

export const MonthViewUIStates: Story = createStorybookComponentStates(monthViewUIStatesConfig) as Story;
MonthViewUIStates.name = 'Month View — UI States';
MonthViewUIStates.play = waitForStoryReady;
