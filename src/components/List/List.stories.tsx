import { faker } from '@faker-js/faker';
import { ReactListItem } from '../../models';
import { Meta, StoryObj } from '@storybook/react';
import { createStory } from '../../Storybook';
import { List, ListOnRequest } from './List';
import { useBound } from '../../hooks';
import { SelectableListItem } from './Items';

faker.seed(10121);

const staticItems = new Array(150).fill(0).map((): ReactListItem => {
  return {
    id: faker.string.uuid(),
    text: '',
    label: <span>{faker.person.fullName()}</span>,
  };
});

const meta: Meta<typeof List> = {
  component: List,
};
export default meta;

type Story = StoryObj<typeof List>;

export const LazyLoadedItems: Story = createStory<typeof List>({
  args: {
    label: 'List',
  },
  width: 200,
  height: 300,
  render: props => {
    const handleAdd = useBound(() => {
      // eslint-disable-next-line no-alert
      window.alert('Add');
    });

    const handleRequest = useBound<ListOnRequest>(async ({ offset = 0, limit }) => {
      await Promise.delay(2000);
      return {
        items: staticItems.slice(offset, offset + limit),
        total: staticItems.length,
        offset,
        limit,
      };
    });

    return (
      <List
        label={'List'}
        {...props}
        renderItemsUsing={SelectableListItem}
        onRequest={handleRequest}
        onAdd={handleAdd}
      />
    );
  },
});
