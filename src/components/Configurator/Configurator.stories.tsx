import { createStory } from '../../Storybook';
import { faker } from '@faker-js/faker'; 6;
import type { Meta, StoryObj } from '@storybook/react';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice } from './configurator-models';
import { Configurator } from './Configurator';
import { UIState } from '../../providers';
import type { AnyObject } from '@anupheaus/common';
import { Icon } from '../Icon';
import type { ComponentProps } from 'react';

const firstColumn: ConfiguratorFirstCell = {
  label: 'Location',
  minWidth: 130,
};

const footer: ConfiguratorItem<GroupItem, AnyObject, Quote> = {
  id: 'footer',
  text: 'Total',
  data: { name: 'Total' },
  renderCell: ({ data }) => data.items.sum(({ price }) => price),
  subItems: [],
};

interface GroupItem {
  name: string;
}

const items: ConfiguratorItem<GroupItem, AnyObject, Quote>[] = [{
  id: 'item-1',
  text: 'Lounge 1',
  data: { name: 'Lounge 1', },
  renderCell: ({ id, data }) => {
    if (id === 'types-1') return null;
    return data.items.filter(({ location }) => ['window-1', 'window-2'].includes(location)).sum(({ price }) => price);
  },
  subItems: [
    { id: 'window-1', text: 'Window 1', data: { name: 'Window 1' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-1')?.price ?? null },
    { id: 'window-2', text: 'Window 2', data: { name: 'Window 2' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-2')?.price ?? null },
  ]
}, {
  id: 'item-2',
  text: 'Lounge 2',
  data: { name: 'Lounge 2' },
  renderCell: ({ id, data }) => {
    if (id === 'types-1') return null;
    return data.items.filter(({ location }) => ['window-3', 'window-4'].includes(location)).sum(({ price }) => price);
  },
  subItems: [
    { id: 'window-3', text: 'Window 3', data: { name: 'Window 3' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-3')?.price ?? null },
    { id: 'window-4', text: 'Window 4', data: { name: 'Window 4' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-4')?.price ?? null },
  ]
}, {
  id: 'item-3',
  text: 'Kitchen',
  data: { name: 'Kitchen' },
  renderCell: ({ id, data }) => {
    if (id === 'types-1') return null;
    return data.items.filter(({ location }) => ['window-5'].includes(location)).sum(({ price }) => price);
  },
  subItems: [
    { id: 'window-5', text: 'Window 5', data: { name: 'Window 5' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-5')?.price ?? null },
  ]
}, {
  id: 'item-4',
  text: 'Bedroom 1',
  data: { name: 'Bedroom 1' },
  renderCell: ({ id, data }) => {
    if (id === 'types-1') return null;
    return data.items.filter(({ location }) => ['window-6'].includes(location)).sum(({ price }) => price);
  },
  subItems: [
    { id: 'window-6', text: 'Window 6', data: { name: 'Window 6' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-6')?.price ?? null },
    { id: 'window-7', text: 'Window 7', data: { name: 'Window 7' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-7')?.price ?? null },
    { id: 'window-8', text: 'Window 8', data: { name: 'Window 8' }, renderCell: ({ data }) => data.items.find(({ location }) => location === 'window-8')?.price ?? null },
  ],
}];

interface QuoteItem {
  location: string;
  price: number;
}

interface Quote {
  name: string;
  items: QuoteItem[];
}

const slices: ConfiguratorSlice<Quote>[] = [
  {
    id: 'types-1',
    text: 'Blind Types',
    label: (<Icon name="window-close" />),
    data: { name: 'RB, VT', items: [] },
    isPinned: true,
    minWidth: 45,
    doNotApplySliceStyles: true,
  },
  {
    id: 'quote-1',
    text: 'Quote 1',
    data: {
      name: 'Lounge (group 1)',
      items: [{ location: 'window-1', price: 354 }, { location: 'window-2', price: 734 }, { location: 'window-3', price: 879 }, { location: 'window-4', price: 236 }, { location: 'window-5', price: 453 }]
    },
    isResizable: true,
    aggregation: 'sum',
  },
  {
    id: 'quote-2',
    text: 'Quote 2',
    data: {
      name: 'Lounge (group 2)',
      items: [{ location: 'window-1', price: 546 }, { location: 'window-2', price: 768 }, { location: 'window-3', price: 321 }, { location: 'window-4', price: 489 }, { location: 'window-5', price: 165 }]
    },
    isResizable: true,
    aggregation: 'sum'
  },
  {
    id: 'quote-3',
    text: 'Quote 3',
    data: {
      name: 'Kitchen (group 1)',
      items: [{ location: 'window-1', price: 345 }, { location: 'window-2', price: 615 }, { location: 'window-3', price: 321 }, { location: 'window-4', price: 519 }, { location: 'window-5', price: 754 }]
    },
    isResizable: true,
    aggregation: 'sum',
  },
];

faker.seed(10121);

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

export const Loading: Story = createStory({
  width: 1100,
  height: 200,
  render: () => {
    return (
      <UIState isLoading>
        <StandardConfigurator />
      </UIState>
    );
  },
});

export const WithData: Story = createStory({
  width: 300,
  height: 300,
  render: () => {
    return (
      <StandardConfigurator />
    );
  },
});

export const WithNoSlices: Story = createStory({
  width: 300,
  height: 300,
  render: () => {
    return (
      <StandardConfigurator slices={[]} />
    );
  },
});
