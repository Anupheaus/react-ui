import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Calendar } from './Calendar';
import { CalendarEntryRecord } from './CalendarModels';
import { DateTime } from 'luxon';
import { FaUmbrellaBeach, FaBaby } from 'react-icons/fa';
import { MdBusinessCenter, MdOutlineSick } from 'react-icons/md';
import { ComponentProps } from 'react';
import { createComponent } from '../Component';
import { configureIcons } from '../Icon';

configureIcons({
  holiday: ({ size }) => (<FaUmbrellaBeach size={size} />),
  business: ({ size }) => (<MdBusinessCenter size={size} />),
  sick: ({ size }) => (<MdOutlineSick size={size} />),
  paternity: ({ size }) => (<FaBaby size={size} />),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ModifiedCalendarEntryRecord = Omit<CalendarEntryRecord, 'icon'> & { icon: string; };

const entries = ([
  { id: '1', title: 'Tony on Holiday', startDate: DateTime.now().minus({ days: 12 }).toJSDate(), endDate: DateTime.now().plus({ days: 6 }).toJSDate(), color: '#9ADDFB', icon: 'holiday' },
  { id: '2', title: 'Jodie on Business Conference', startDate: DateTime.now().minus({ days: 6 }).toJSDate(), endDate: DateTime.now().plus({ days: 9 }).toJSDate(), color: '#99D5CF', icon: 'business' },
  { id: '3', title: 'Harrison on Sick Leave', startDate: DateTime.now().minus({ days: 11 }).toJSDate(), endDate: DateTime.now().minus({ days: 6 }).toJSDate(), color: '#FDE69C', icon: 'sick' },
  { id: '4', title: 'Lucas on Holiday', startDate: DateTime.now().plus({ days: 2 }).toJSDate(), endDate: DateTime.now().plus({ days: 3 }).toJSDate(), color: '#C2B0E2', icon: 'holiday' },
  { id: '5', title: 'Hayden on Paternity Leave', startDate: DateTime.now().minus({ days: 1 }).toJSDate(), endDate: DateTime.now().plus({ days: 1 }).toJSDate(), color: '#FDBCA7', icon: 'paternity' },
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
