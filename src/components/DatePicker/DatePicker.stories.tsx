import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { useUpdatableState } from '../../hooks';
import { DatePicker } from './DatePicker';
import { DateTime } from 'luxon';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

const config = {
  storyName: '',
  args: {
    label: 'Label',
    value: DateTime.now(),
  },
  render: props => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (
      <DatePicker {...props} value={value} onChange={setValue} />
    );
  },
} satisfies Story;

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
