import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Label } from './Label';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';

const meta: Meta<typeof Label> = {
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

const config = {
  args: {
    children: 'Label',
    isOptional: false,
  },
  render: (props: React.ComponentProps<typeof Label>) => <Label {...props} />,
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates(config);
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

export const UIStatesWithOptional: Story = createStorybookComponentStates({ ...config, args: { ...config.args, isOptional: true } });
UIStatesWithOptional.name = 'UI States as Optional';
UIStatesWithOptional.play = waitForStoryReady;

export const UIStatesWithHelp: Story = createStorybookComponentStates({ ...config, args: { ...config.args, help: 'This is my help' } });
UIStatesWithHelp.name = 'UI States with Help';
UIStatesWithHelp.play = waitForStoryReady;

export const UIStatesWithOptionalAndHelp: Story = createStorybookComponentStates({ ...config, args: { ...config.args, isOptional: true, help: 'This is my help' } });
UIStatesWithOptionalAndHelp.name = 'UI States as Optional with Help';
UIStatesWithOptionalAndHelp.play = waitForStoryReady;
