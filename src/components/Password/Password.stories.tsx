import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { useUpdatableState } from '../../hooks';
import { Password } from './Password';

const meta: Meta<typeof Password> = {
  component: Password,
};
export default meta;

type Story = StoryObj<typeof Password>;

const config = {
  storyName: '',
  args: {
    label: 'Label',
    value: 'Hey'
  },
  render: props => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (
      <Password {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

export const UIStates = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
