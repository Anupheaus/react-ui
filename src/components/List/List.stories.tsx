import { faker } from '@faker-js/faker';
import type { ReactListItem } from '../../models';
import type { Meta, StoryObj } from '@storybook/react';
import { createStory } from '../../Storybook';
import type { ListOnRequest } from './List';
import { List } from './List';
import { useBound } from '../../hooks';
import { useState } from 'react';

faker.seed(10121);

const staticItems = new Array(150).fill(0).map((): ReactListItem => {
  return {
    id: faker.string.uuid(),
    text: '',
    label: <span>{faker.person.fullName().slice(0, 9)}</span>,
  };
});

const meta: Meta<typeof List> = {
  component: List,
};
export default meta;

type Story = StoryObj<typeof List>;

export const LazyLoadListItems: Story = createStory<typeof List>({
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

    const handleRequest = useBound<ListOnRequest>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) => {
      await Promise.delay(2000);
      respondWith({
        requestId,
        items: staticItems.slice(offset, offset + limit),
        total: staticItems.length,
      });
    });

    return (
      <List<void>
        label={'List'}
        {...props}
        onRequest={handleRequest}
        onAdd={handleAdd}
      />
    );
  },
});

export const LazyLoadSelectableListItems: Story = createStory<typeof List>({
  args: {
    label: 'List',
  },
  width: 200,
  height: 300,
  render: props => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const handleAdd = useBound(() => {
      // eslint-disable-next-line no-alert
      window.alert('Add');
    });

    const handleRequest = useBound<ListOnRequest>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) => {
      await Promise.delay(2000);
      respondWith({
        requestId,
        items: staticItems.slice(offset, offset + limit),
        total: staticItems.length,
      });
    });

    return (
      <List<void>
        label={'List'}
        {...props}
        onRequest={handleRequest}
        onAdd={handleAdd}
        value={selectedItems}
        maxSelectableItems={2}
        onChange={setSelectedItems}
      />
    );
  },
});