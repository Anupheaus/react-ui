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
import { Flex } from '../Flex';
import { Text } from '../Text';
import { Scroller } from '../Scroller';
import { DefaultTheme, ThemeProvider } from '../../theme';

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

// Empty-message helpers mirror those used in List.tests.tsx so the stories exercise the same data-source behaviour.
const emptyMessageItems: ReactListItem[] = [
  { id: 'item-1', text: 'Alpha' },
  { id: 'item-2', text: 'Beta' },
];

const emptyListRequest: ListOnRequest = async ({ requestId }, respondWith) => {
  respondWith({ requestId, items: [], total: 0 });
};

const populatedListRequest: ListOnRequest = async ({ requestId, pagination: { offset = 0, limit } }, respondWith) => {
  respondWith({
    requestId,
    items: emptyMessageItems.slice(offset, offset + limit),
    total: emptyMessageItems.length,
  });
};

const pendingListRequest: ListOnRequest = () => new Promise<void>(() => void 0);

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
  parameters: { test: { skipScreenshot: true } },
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
  parameters: { test: { skipScreenshot: true } },
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

export const InlineListWithTooLittleContent: Story = createStory<ListDefault>({
  args: {
    label: 'List',
  },
  width: 280,
  height: 500,
  render: (props: ListProps) => {
    const smallerList = staticItems.slice(0, 3);

    const handleRequest = useBound<ListOnRequest>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) =>
      respondWith({
        requestId,
        items: smallerList.slice(offset, offset + limit),
        total: smallerList.length,
      }));

    const handleAdd = useBound(() => {
      // eslint-disable-next-line no-alert
      window.alert('Add');
    });

    return (
      <Flex isVertical gap="fields">
        <Text value="Test" wide />
        <List
          label="List"
          {...props}
          onRequest={handleRequest}
          onAdd={handleAdd}
        />
      </Flex>
    );
  },
});

export const InlineListWithTooMuchContent: Story = createStory<ListDefault>({
  args: {
    label: 'List',
  },
  width: 280,
  height: 500,
  render: (props: ListProps) => {
    const smallerList = staticItems.slice(0, 20);

    const handleRequest = useBound<ListOnRequest>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) =>
      respondWith({
        requestId,
        items: smallerList.slice(offset, offset + limit),
        total: smallerList.length,
      }));

    const handleAdd = useBound(() => {
      // eslint-disable-next-line no-alert
      window.alert('Add');
    });

    return (
      <Flex isVertical gap="fields">
        <Text value="Test" wide />
        <List
          label="List"
          {...props}
          onRequest={handleRequest}
          onAdd={handleAdd}
        />
      </Flex>
    );
  },
});

// ─── Footer stories ───────────────────────────────────────────────────────────

export const ListFooterCountOnly: Story = createStory<ListDefault>({
  width: 280,
  height: 200,
  render: () => (
    <List label="People" items={staticItems.slice(0, 5)} />
  ),
});

export const ListFooterWithAddLabel: Story = createStory<ListDefault>({
  width: 280,
  height: 200,
  render: () => {
    const items = staticItems.slice(0, 5);
    // eslint-disable-next-line no-alert
    const handleAdd = useBound(() => window.alert('Add person'));
    return <List label="People" items={items} onAdd={handleAdd} addLabel="Add person" />;
  },
});

export const ListFooterWithAddTooltip: Story = createStory<ListDefault>({
  width: 280,
  height: 200,
  render: () => {
    const items = staticItems.slice(0, 5);
    // eslint-disable-next-line no-alert
    const handleAdd = useBound(() => window.alert('Add person'));
    return (
      <List
        label="People"
        items={items}
        onAdd={handleAdd}
        addTooltip="Click to add a new person to the list"
      />
    );
  },
});

export const ListFooterWithSummary: Story = createStory<ListDefault>({
  width: 280,
  height: 200,
  render: () => {
    const items = staticItems.slice(0, 5);
    // eslint-disable-next-line no-alert
    const handleAdd = useBound(() => window.alert('Add'));
    return (
      <List
        label="People"
        items={items}
        onAdd={handleAdd}
        summary="Last synced: just now"
      />
    );
  },
});

export const ListFooterCustomUnitName: Story = createStory<ListDefault>({
  width: 280,
  height: 200,
  render: () => (
    <List label="People" items={staticItems.slice(0, 12)} unitName="person" />
  ),
});

export const ListFooterHideCount: Story = createStory<ListDefault>({
  width: 280,
  height: 200,
  render: () => {
    const items = staticItems.slice(0, 5);
    // eslint-disable-next-line no-alert
    const handleAdd = useBound(() => window.alert('Add'));
    return (
      <List label="People" items={items} onAdd={handleAdd} addLabel="Add person" hideRecordCount />
    );
  },
});

export const ListFooterWithRequestError: Story = createStory<ListDefault>({
  parameters: { test: { skipScreenshot: true } },
  width: 280,
  height: 200,
  render: () => {
    const handleRequest = useBound<ListOnRequest>(async () => {
      await Promise.delay(800);
      throw new Error('Failed to load items from the server');
    });
    return <List label="People" onRequest={handleRequest} />;
  },
});

// ─────────────────────────────────────────────────────────────────────────────

export const InlineListWithTooMuchContentInsideScrollableContainer: Story = createStory<ListDefault>({
  args: {
    label: 'List',
  },
  width: 280,
  height: 500,
  render: (props: ListProps) => {
    const smallerList = staticItems.slice(0, 20);

    const handleRequest = useBound<ListOnRequest>(async ({ requestId, pagination: { offset = 0, limit } }, respondWith) =>
      respondWith({
        requestId,
        items: smallerList.slice(offset, offset + limit),
        total: smallerList.length,
      }));

    const handleAdd = useBound(() => {
      // eslint-disable-next-line no-alert
      window.alert('Add');
    });

    return (
      <Scroller>
        <Flex isVertical gap="fields">
          <Text value="Test" wide />
          <List
            label="List"
            {...props}
            onRequest={handleRequest}
            onAdd={handleAdd}
          />
        </Flex>
      </Scroller>
    );
  },
});

export const EmptyMessageDefault: Story = createStory<ListDefault>({
  width: 300,
  height: 400,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <List label="List" onRequest={emptyListRequest} />
    </ThemeProvider>
  ),
});

export const EmptyMessageCustomString: Story = createStory<ListDefault>({
  width: 300,
  height: 400,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <List label="List" onRequest={emptyListRequest} emptyMessage="Nothing here yet" />
    </ThemeProvider>
  ),
});

export const EmptyMessageReactElement: Story = createStory<ListDefault>({
  width: 300,
  height: 400,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <List label="List" onRequest={emptyListRequest} emptyMessage={<span data-testid="custom-empty">Custom empty content</span>} />
    </ThemeProvider>
  ),
});

export const EmptyMessageSuppressed: Story = createStory<ListDefault>({
  width: 300,
  height: 400,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <List label="List" onRequest={emptyListRequest} emptyMessage={null} />
    </ThemeProvider>
  ),
});

export const EmptyMessagePopulated: Story = createStory<ListDefault>({
  width: 300,
  height: 400,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <List label="List" onRequest={populatedListRequest} emptyMessage="Nothing here yet" />
    </ThemeProvider>
  ),
});

export const EmptyMessageLoading: Story = createStory<ListDefault>({
  width: 300,
  height: 400,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <List label="List" onRequest={pendingListRequest} emptyMessage="Nothing here yet" />
    </ThemeProvider>
  ),
});

