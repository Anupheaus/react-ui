import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useUpdatableState } from '../../hooks';
import { Password } from './Password';

const meta: Meta<typeof Password> = {
  component: Password,
};
export default meta;

type Story = StoryObj<typeof Password>;

const config = {
  args: {
    label: 'Label',
    value: 'Hey',
  },
  render: (props: React.ComponentProps<typeof Password>) => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);
    return (
      <Password {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
