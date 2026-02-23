import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { InternalText } from './InternalText';
import { useUpdatableState } from '../../hooks';

const meta: Meta<typeof InternalText> = {
  component: InternalText,
};
export default meta;

type Story = StoryObj<typeof InternalText>;

const config = {
  args: {
    tagName: 'field',
    label: 'Label',
    value: 'Hey',
  },
  render: (props: React.ComponentProps<typeof InternalText>) => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);
    return (
      <InternalText {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
