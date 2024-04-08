import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { InternalText } from './InternalText';
import { useUpdatableState } from '../../hooks';

const meta: Meta<typeof InternalText> = {
  component: InternalText,
};
export default meta;

type Story = StoryObj<typeof InternalText>;

const config = {
  storyName: '',
  args: {
    tagName: 'field',
    label: 'Label',
    value: 'Hey'
  },
  render: props => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (
      <InternalText {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
