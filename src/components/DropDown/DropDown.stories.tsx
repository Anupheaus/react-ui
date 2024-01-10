import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
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
  storyName: '',
  args: {
    label: 'Label',
  },
  render: props => {
    const [value, setValue] = useState('');
    return (
      <DropDown {...props} value={value} onChange={setValue} values={options} />
    );
  },
} satisfies Story;

export const UIStates = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
