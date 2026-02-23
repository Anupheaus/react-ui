import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { Calendar } from './Calendar';
import { CalendarEntryRecord } from './CalendarModels';
import { DateTime } from 'luxon';
import type { IconName } from '../Icon';

type ModifiedCalendarEntryRecord = Omit<CalendarEntryRecord, 'icon'> & { icon: IconName };

const entries = ([
  { id: '1', title: 'Tony on Holiday', startDate: DateTime.now().minus({ days: 12 }).toJSDate(), endDate: DateTime.now().plus({ days: 6 }).toJSDate(), color: '#9ADDFB', icon: 'calendar-holiday' },
  { id: '2', title: 'Jodie on Business Conference', startDate: DateTime.now().minus({ days: 6 }).toJSDate(), endDate: DateTime.now().plus({ days: 9 }).toJSDate(), color: '#99D5CF', icon: 'calendar-business' },
  { id: '3', title: 'Harrison on Sick Leave', startDate: DateTime.now().minus({ days: 11 }).toJSDate(), endDate: DateTime.now().minus({ days: 6 }).toJSDate(), color: '#FDE69C', icon: 'calendar-sick' },
  { id: '4', title: 'Lucas on Holiday', startDate: DateTime.now().plus({ days: 2 }).toJSDate(), endDate: DateTime.now().plus({ days: 3 }).toJSDate(), color: '#C2B0E2', icon: 'calendar-holiday' },
  { id: '5', title: 'Hayden on Paternity Leave', startDate: DateTime.now().minus({ days: 1 }).toJSDate(), endDate: DateTime.now().plus({ days: 1 }).toJSDate(), color: '#FDBCA7', icon: 'calendar-paternity' },
] as ModifiedCalendarEntryRecord[]) as CalendarEntryRecord[];

const meta: Meta<typeof Calendar> = {
  component: Calendar,
};
export default meta;

type Story = StoryObj<typeof Calendar>;

const config = {
  args: {},
  render: (props: React.ComponentProps<typeof Calendar>) => <Calendar {...props} entries={entries} />,
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates(config);
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
