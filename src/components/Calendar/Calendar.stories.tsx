import { ComponentProps } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Calendar } from './Calendar';
import { CalendarEntryRecord } from './CalendarModels';
import { DateTime } from 'luxon';
import { Theme } from '../../providers/ThemeProvider';
import { FaUmbrellaBeach, FaBaby } from 'react-icons/fa';
import { MdBusinessCenter, MdOutlineSick } from 'react-icons/md';

const icons = Theme.icons.define({
  holiday: ({ size }) => (<FaUmbrellaBeach size={size} />),
  business: ({ size }) => (<MdBusinessCenter size={size} />),
  sick: ({ size }) => (<MdOutlineSick size={size} />),
  paternity: ({ size }) => (<FaBaby size={size} />),
});

const entries: CalendarEntryRecord[] = [
  { id: '1', title: 'Tony on Holiday', startDate: DateTime.now().minus({ days: 12 }).toJSDate(), endDate: DateTime.now().plus({ days: 6 }).toJSDate(), color: '#9ADDFB', icon: icons.holiday },
  { id: '2', title: 'Jodie on Business Conference', startDate: DateTime.now().minus({ days: 6 }).toJSDate(), endDate: DateTime.now().plus({ days: 9 }).toJSDate(), color: '#99D5CF', icon: icons.business },
  { id: '3', title: 'Harrison on Sick Leave', startDate: DateTime.now().minus({ days: 11 }).toJSDate(), endDate: DateTime.now().minus({ days: 6 }).toJSDate(), color: '#FDE69C', icon: icons.sick },
  { id: '4', title: 'Lucas on Holiday', startDate: DateTime.now().plus({ days: 2 }).toJSDate(), endDate: DateTime.now().plus({ days: 3 }).toJSDate(), color: '#C2B0E2', icon: icons.holiday },
  { id: '5', title: 'Hayden on Paternity Leave', startDate: DateTime.now().minus({ days: 1 }).toJSDate(), endDate: DateTime.now().plus({ days: 1 }).toJSDate(), color: '#FDBCA7', icon: icons.paternity },
];

const EditableCalendar = anuxPureFC<ComponentProps<typeof Calendar>>('EditableCalendar', props => {
  // const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (<Calendar entries={entries} />);
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
