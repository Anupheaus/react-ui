import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useUpdatableState } from '../../hooks';
import { DatePicker } from './DatePicker';
import { DateTime } from 'luxon';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

const config = {
  args: {
    label: 'Label',
    value: DateTime.now(),
  },
  render: (props: React.ComponentProps<typeof DatePicker>) => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);
    return (
      <DatePicker {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
