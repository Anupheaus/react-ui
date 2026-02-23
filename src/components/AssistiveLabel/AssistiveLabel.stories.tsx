import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AssistiveLabel } from './AssistiveLabel';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';

const meta: Meta<typeof AssistiveLabel> = {
  component: AssistiveLabel,
};
export default meta;

type Story = StoryObj<typeof AssistiveLabel>;

const config = {
  args: {
    children: 'Label',
  },
  render: (props: React.ComponentProps<typeof AssistiveLabel>) => <AssistiveLabel {...props} />,
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
