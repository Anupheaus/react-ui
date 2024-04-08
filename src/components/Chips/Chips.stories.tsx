import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { useState } from 'react';
import { ListItem } from '@anupheaus/common';
import { Chips } from './Chips';

const meta: Meta<typeof Chips> = {
  component: Chips,
};
export default meta;

type Story = StoryObj<typeof Chips>;

const options: ListItem[] = [
  { id: '1', text: 'One' },
  { id: '2', text: 'Two' },
  { id: '3', text: 'Three' },
  { id: '4', text: 'Four' },
  { id: '5', text: 'Five' },
  { id: '6', text: 'Six' },
];

const config = {
  storyName: '',
  args: {
    label: 'Label',
  },
  render: props => {
    const [value, setValue] = useState<string[]>();
    return (
      <Chips {...props} value={value} onChange={setValue} values={options} />
    );
  },
} satisfies Story;

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
