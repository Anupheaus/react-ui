import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
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
    ],
  },
  {
    id: '2', text: 'Item 2', maxSelectableItems: true, subItems: [
      { id: '2-1', text: 'Sub Item 1' },
      { id: '2-2', text: 'Sub Item 2' },
      { id: '2-3', text: 'Sub Item 3' },
    ],
  },
];

const meta: Meta<typeof Selector> = {
  component: Selector,
};
export default meta;

type Story = StoryObj<typeof Selector>;

const StandardSelector = (props: Partial<ComponentProps<typeof Selector>>) => (
  <Selector label="Select an item" items={items} {...props} />
);

export const Loading: Story = createStory<typeof Selector>({
  width: 300,
  height: 300,
  render: () => (
    <UIState isLoading>
      <StandardSelector />
    </UIState>
  ),
});

export const WithData: Story = createStory<typeof Selector>({
  width: 300,
  height: 300,
  render: () => <StandardSelector />,
});

export const WithOneSectionOfData: Story = createStory<typeof Selector>({
  width: 300,
  height: 300,
  render: () => <StandardSelector items={[items[0]]} />,
});
