import { faker } from '@faker-js/faker';
import type { ReactListItem } from '../../models';
import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
import type { ListOnRequest, ListProps } from './List';
import { List } from './List';
import { useBound } from '../../hooks';
import { useState } from 'react';
import { Button } from '../Button';
import { useScroller } from '../Scroller/useScroller';

function ScrollPositionLabel() {
  const { scrollTop } = useScroller();
  return <span style={{ fontSize: 12, opacity: 0.8 }}>Scroll: {Math.round(scrollTop)}px</span>;
}

type ListDefault = ComponentType<ListProps>;

faker.seed(10121);

const staticItems = new Array(150).fill(0).map((): ReactListItem => ({
  id: faker.string.uuid(),
  text: '',
  label: <span>{faker.person.fullName()}</span>,
}));

const itemsWithSubItems: ReactListItem[] = [
  {
    id: 'cat-1',
    text: 'Fruit',
    subItems: [
      { id: 'cat-1-1', text: 'Apple' },
      { id: 'cat-1-2', text: 'Banana' },
      {
        id: 'cat-1-3',
        text: 'Orange',
        subItems: [
          { id: 'cat-1-3-1', text: 'Mandarin' },
          { id: 'cat-1-3-2', text: 'Tangerine' },
          { id: 'cat-1-3-3', text: 'Clementine' },
        ],
      },
    ],
  },
  {
    id: 'cat-2',
    text: 'Vegetables',
    subItems: [
      { id: 'cat-2-1', text: 'Carrot' },
      { id: 'cat-2-2', text: 'Broccoli' },
    ],
  },
  {
    id: 'cat-3',
    text: 'Dairy',
    subItems: [
      { id: 'cat-3-1', text: 'Milk' },
      { id: 'cat-3-2', text: 'Cheese' },
      { id: 'cat-3-3', text: 'Yogurt' },
    ],
  },
];

const meta: Meta<ListDefault> = {
  component: List as ListDefault,
};
export default meta;

type Story = StoryObj<ListDefault>;

export const LazyLoadListItems: Story = createStory<ListDefault>({
  args: {
    label: 'List',
  },
  width: 200,
  height: 300,
  render: (props: ListProps) => {
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
      <List
        label="List"
        {...props}
        onRequest={handleRequest}
        onAdd={handleAdd}
      />
    );
  },
});

export const LazyLoadSelectableListItems: Story = createStory<ListDefault>({
  args: {
    label: 'List',
  },
  width: 200,
  height: 300,
  render: (props: ListProps) => {
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
      <List
        label="List"
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

export const ListItemsWithSubItems: Story = createStory<ListDefault>({
  args: {
    label: 'List with sub-items',
  },
  width: 240,
  height: 320,
  render: () => {
    const handleRequest = useBound<ListOnRequest<void>>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) => {
      await Promise.delay(800);
      respondWith({
        requestId,
        items: itemsWithSubItems.slice(offset, offset + limit),
        total: itemsWithSubItems.length,
      });
    });

    return (
      <List
        label="Categories"
        onRequest={handleRequest}
      />
    );
  },
});

export const ListWithStickyHeader: Story = createStory<ListDefault>({
  args: {
    label: 'List',
  },
  width: 280,
  height: 320,
  render: (props: ListProps) => {
    const smallerList = staticItems.slice(0, 15);

    const handleRequest = useBound<ListOnRequest>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) => {
      await Promise.delay(600);
      respondWith({
        requestId,
        items: smallerList.slice(offset, offset + limit),
        total: smallerList.length,
      });
    });

    const handleAdd = useBound(() => {
      // eslint-disable-next-line no-alert
      window.alert('Add');
    });

    return (
      <List
        label="List"
        {...props}
        onRequest={handleRequest}
        onAdd={handleAdd}
        stickyHeader={(
          <>
            <Button size="small">Filter</Button>
            <Button size="small">Sort</Button>
            <ScrollPositionLabel />
          </>
        )}
      />
    );
  },
});
