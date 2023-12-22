import { createStories, StorybookComponent } from '../../Storybook';
import { faker } from '@faker-js/faker';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { List } from './List';
import { ReactListItem } from '../../models';
import { DraggableListItem } from './Items';
import { AnyObject, Record } from '@anupheaus/common';
import { ComponentProps, useState } from 'react';
import { Flex } from '../Flex';

faker.seed(10121);
// faker.setLocale('en_GB');

const draggableItems = new Array(10).fill(0).map((): ReactListItem => {
  const data = {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
  } satisfies Record & AnyObject;
  return {
    id: data.id,
    text: data.name,
    label: <DraggableListItem data={data}>{data.name}</DraggableListItem>,
  };
});

const DemoableList = (props: Partial<ComponentProps<typeof List>>) => {
  const [items, setItems] = useState(() => draggableItems);
  return (
    <Flex fixedSize width={500} height={200}>
      <List label={'List'} {...props} items={items} onChange={setItems} gap={8} />
    </Flex>
  );
};

createStories(({ createStory }) => ({
  name: 'Components/List',
  module,
  stories: {
    ...generateUIStateStories(DemoableList),
    'Draggable List': createStory({
      wrapInStorybookComponent: false,
      component: () => (<>
        <StorybookComponent title={'Draggable List with Overlay'}>
          <DemoableList label={'Draggable List'} />
        </StorybookComponent>

        <StorybookComponent title={'Draggable List without Overlay'}>
          <DemoableList label={'Draggable List'} disableOverlay />
        </StorybookComponent>
      </>),
    }),
  },
}));