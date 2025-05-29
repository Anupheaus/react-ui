import { createStory } from '../../Storybook';
import { faker } from '@faker-js/faker'; 6;
import type { Meta, StoryObj } from '@storybook/react';
import { UIState } from '../../providers';
import { Selector } from './Selector';
import type { SelectorItem } from './selector-models';
import type { ComponentProps } from 'react';

const items: SelectorItem[] = [
  {
    id: '1', text: 'Item 1', subItems: [
      { id: '1-1', text: 'Window', iconName: 'window-maximize' },
      { id: '1-2', text: 'Door', iconName: 'drawer-close' },
      { id: '1-3', text: 'Sofa', iconName: 'calendar' },
      { id: '1-4', text: 'Chair', iconName: 'button-apply' },
      { id: '1-5', text: 'Table', iconName: 'arrow-down' },
      { id: '1-6', text: 'Chair', iconName: 'button-apply' },
      { id: '1-7', text: 'Table', iconName: 'arrow-down' },
      { id: '1-8', text: 'Chair', iconName: 'button-apply' },
      { id: '1-9', text: 'Table', iconName: 'arrow-down' },
      { id: '1-10', text: 'Chair', iconName: 'button-apply' },
      { id: '1-11', text: 'Table', iconName: 'arrow-down' },

    ]
  },
  {
    id: '2', text: 'Item 2', allowMultiSelect: true, subItems: [
      { id: '2-1', text: 'Sub Item 1' },
      { id: '2-2', text: 'Sub Item 2' },
      { id: '2-3', text: 'Sub Item 3' },
    ]
  },
  // {
  //   id: '3', text: 'Item 3', subItems: [
  //     { id: '3-1', text: 'Sub Item 1' },
  //     { id: '3-2', text: 'Sub Item 2' },
  //     { id: '3-3', text: 'Sub Item 3' },
  //   ]
  // },
];

faker.seed(10121);

const meta: Meta<typeof Selector> = {
  component: Selector,
};
export default meta;

type Story = StoryObj<typeof Selector>;

const StandardSelector = (props: Partial<ComponentProps<typeof Selector>>) => {
  return (
    <Selector
      label="Select an item"
      items={items}
      {...props}
    />
  );
};

export const Loading: Story = createStory({
  width: 300,
  height: 300,
  render: () => {
    return (
      <UIState isLoading>
        <StandardSelector />
      </UIState>
    );
  },
});

export const WithData: Story = createStory({
  width: 300,
  height: 300,
  render: () => {
    return (
      <StandardSelector />
    );
  },
});

export const WithOneSectionOfData: Story = createStory({
  width: 300,
  height: 300,
  render: () => {
    return (
      <StandardSelector
        items={[items[0]]}
      />
    );
  },
});
