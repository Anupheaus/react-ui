import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { useUpdatableState } from '../../hooks';
import { Number } from './Number';

const meta: Meta<typeof Number> = {
  component: Number,
};
export default meta;

type Story = StoryObj<typeof Number>;

const config = {
  storyName: '',
  args: {
    label: 'Label',
    value: 3,
  },
  render: props => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (
      <Number {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

export const UIStates = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
