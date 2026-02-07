import '@anupheaus/common';
import { createStory } from '../../Storybook';
import type { Meta, StoryObj } from '@storybook/react';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice } from './configurator-models';
import { Configurator } from './Configurator';
import { UIState } from '../../providers';
import type { ComponentProps } from 'react';

// Blinds company domain: Rooms (main rows), Windows (sub-rows), Quotes (columns)
interface Room {
  name: string;
}

interface Window {
  name: string;
}

interface QuoteLineItem {
  windowId: string;
  price: number;
}

interface Quote {
  name: string;
  items: QuoteLineItem[];
}

function roomTotalForQuote(windowIds: string[], quote: Quote): number {
  return quote.items
    .filter(line => windowIds.includes(line.windowId))
    .sum(line => line.price);
}

const firstColumn: ConfiguratorFirstCell = {
  label: 'Room',
  minWidth: 130,
};

const items: ConfiguratorItem<Room, Window, Quote>[] = [
  {
    id: 'room-1',
    text: 'Lounge',
    data: { name: 'Lounge' },
    renderCell: (item, slice) => {
      if (slice.id === 'types-1') return null;
      return roomTotalForQuote(item.subItems.map(s => s.id), slice.data);
    },
    subItems: [
      { id: 'window-1', text: 'Window 1', data: { name: 'Window 1' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
      { id: 'window-2', text: 'Window 2', data: { name: 'Window 2' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
    ],
  },
  {
    id: 'room-2',
    text: 'Kitchen',
    data: { name: 'Kitchen' },
    renderCell: (item, slice) => {
      if (slice.id === 'types-1') return null;
      return roomTotalForQuote(item.subItems.map(s => s.id), slice.data);
    },
    subItems: [
      { id: 'window-3', text: 'Window 3', data: { name: 'Window 3' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
      { id: 'window-4', text: 'Window 4', data: { name: 'Window 4' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
      { id: 'window-5', text: 'Window 5', data: { name: 'Window 5' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
    ],
  },
  {
    id: 'room-3',
    text: 'Bedroom 1',
    data: { name: 'Bedroom 1' },
    renderCell: (item, slice) => {
      if (slice.id === 'types-1') return null;
      return roomTotalForQuote(item.subItems.map(s => s.id), slice.data);
    },
    subItems: [
      { id: 'window-6', text: 'Window 6', data: { name: 'Window 6' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
      { id: 'window-7', text: 'Window 7', data: { name: 'Window 7' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
      { id: 'window-8', text: 'Window 8', data: { name: 'Window 8' }, renderCell: (subItem, slice) => slice.id === 'types-1' ? null : (slice.data.items.find(i => i.windowId === subItem.id)?.price ?? null) },
    ],
  },
];

const footer: ConfiguratorItem<Room, Window, Quote> = {
  id: 'footer',
  text: 'Total',
  data: { name: 'Total' },
  renderCell: (_item, slice) => (slice.id === 'types-1' ? null : slice.data.items.sum(i => i.price)),
  subItems: [],
};

const slices: ConfiguratorSlice<Quote>[] = [
  {
    id: 'quote-1',
    text: 'Quote 1',
    data: {
      name: 'Quote 1',
      items: [
        { windowId: 'window-1', price: 354 }, { windowId: 'window-2', price: 734 }, { windowId: 'window-3', price: 879 },
        { windowId: 'window-4', price: 236 }, { windowId: 'window-5', price: 453 }, { windowId: 'window-6', price: 120 },
        { windowId: 'window-7', price: 230 }, { windowId: 'window-8', price: 180 },
      ],
    },
    isResizable: true,
    aggregation: 'sum',
  },
  {
    id: 'quote-2',
    text: 'Quote 2',
    data: {
      name: 'Quote 2',
      items: [
        { windowId: 'window-1', price: 546 }, { windowId: 'window-2', price: 768 }, { windowId: 'window-3', price: 321 },
        { windowId: 'window-4', price: 489 }, { windowId: 'window-5', price: 165 }, { windowId: 'window-6', price: 210 },
        { windowId: 'window-7', price: 190 }, { windowId: 'window-8', price: 220 },
      ],
    },
    isResizable: true,
    aggregation: 'sum',
  },
  {
    id: 'quote-3',
    text: 'Quote 3',
    data: {
      name: 'Quote 3',
      items: [
        { windowId: 'window-1', price: 345 }, { windowId: 'window-2', price: 615 }, { windowId: 'window-3', price: 321 },
        { windowId: 'window-4', price: 519 }, { windowId: 'window-5', price: 754 }, { windowId: 'window-6', price: 165 },
        { windowId: 'window-7', price: 275 }, { windowId: 'window-8', price: 195 },
      ],
    },
    isResizable: true,
    aggregation: 'sum',
  },
];

const meta: Meta<typeof Configurator> = {
  component: Configurator,
};
export default meta;

type Story = StoryObj<typeof Configurator>;

const StandardConfigurator = (props: Partial<ComponentProps<typeof Configurator>>) => {
  return (
    <Configurator
      firstCell={firstColumn}
      items={items}
      slices={slices}
      footer={footer}
      {...props}
    />
  );
};

export const Loading: Story = createStory<typeof Configurator>({
  args: {},
  width: 1100,
  height: 300,
  render: () => (
    <UIState isLoading>
      <StandardConfigurator />
    </UIState>
  ),
});

export const WithData: Story = createStory<typeof Configurator>({
  args: {},
  width: 1100,
  height: 400,
  render: () => <StandardConfigurator />,
});

export const WithNoSlices: Story = createStory<typeof Configurator>({
  args: {},
  width: 300,
  height: 300,
  render: () => <StandardConfigurator slices={[]} />,
});
