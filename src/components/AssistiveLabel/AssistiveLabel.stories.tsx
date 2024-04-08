import { Meta, StoryObj } from '@storybook/react';
import { AssistiveLabel } from './AssistiveLabel';
import { createStorybookComponentStates } from '../../Storybook';

const meta: Meta<typeof AssistiveLabel> = {
  component: AssistiveLabel,
};
export default meta;

type Story = StoryObj<typeof AssistiveLabel>;

const config = {
  storyName: '',
  args: {
    children: 'Label',
  },
  render: props => (
    <AssistiveLabel {...props} />
  ),
} satisfies Story;

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
