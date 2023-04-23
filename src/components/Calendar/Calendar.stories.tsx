import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Calendar } from './Calendar';
import { CalendarEntryRecord } from './CalendarModels';
import { DateTime } from 'luxon';
import { ComponentProps } from 'react';
import { createComponent } from '../Component';
import { IconName } from '../Icon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ModifiedCalendarEntryRecord = Omit<CalendarEntryRecord, 'icon'> & { icon: IconName; };

const entries = ([
  { id: '1', title: 'Tony on Holiday', startDate: DateTime.now().minus({ days: 12 }).toJSDate(), endDate: DateTime.now().plus({ days: 6 }).toJSDate(), color: '#9ADDFB', icon: 'calendar-holiday' },
  { id: '2', title: 'Jodie on Business Conference', startDate: DateTime.now().minus({ days: 6 }).toJSDate(), endDate: DateTime.now().plus({ days: 9 }).toJSDate(), color: '#99D5CF', icon: 'calendar-business' },
  { id: '3', title: 'Harrison on Sick Leave', startDate: DateTime.now().minus({ days: 11 }).toJSDate(), endDate: DateTime.now().minus({ days: 6 }).toJSDate(), color: '#FDE69C', icon: 'calendar-sick' },
  { id: '4', title: 'Lucas on Holiday', startDate: DateTime.now().plus({ days: 2 }).toJSDate(), endDate: DateTime.now().plus({ days: 3 }).toJSDate(), color: '#C2B0E2', icon: 'calendar-holiday' },
  { id: '5', title: 'Hayden on Paternity Leave', startDate: DateTime.now().minus({ days: 1 }).toJSDate(), endDate: DateTime.now().plus({ days: 1 }).toJSDate(), color: '#FDBCA7', icon: 'calendar-paternity' },
]satisfies ModifiedCalendarEntryRecord[]) as CalendarEntryRecord[];

interface Props extends ComponentProps<typeof Calendar> { }

const EditableCalendar = createComponent('EditableCalendar', (props: Props) => {
  return (<Calendar {...props} entries={entries} />);
});

function generateStories(): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => (<>
      <StorybookComponent title="Normal">
        <EditableCalendar />
      </StorybookComponent>
    </>),
  };
}

createStories(() => ({
  module,
  name: 'Components/Calendar',
  stories: {
    ...generateUIStateStories(props => <EditableCalendar {...props} />),
    'Tests': generateStories(),
  },
}));
