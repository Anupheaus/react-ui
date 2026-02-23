import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useState } from 'react';
import { DropDown } from './DropDown';
import { ListItem } from '@anupheaus/common';

const meta: Meta<typeof DropDown> = {
  component: DropDown,
};
export default meta;

type Story = StoryObj<typeof DropDown>;

const options: ListItem[] = [
  { id: '1', text: 'One' },
  { id: '2', text: 'Two' },
  { id: '3', text: 'Three' },
  { id: '4', text: 'Four' },
  { id: '5', text: 'Five' },
  { id: '6', text: 'Six' },
];

const config = {
  args: {
    label: 'Label',
  },
  render: (props: React.ComponentProps<typeof DropDown>) => {
    const [value, setValue] = useState('');
    return (
      <DropDown {...props} value={value} onChange={setValue} values={options} />
    );
  },
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
