import type { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { useUpdatableState } from '../../hooks';
import { Number } from './Number';

const meta: Meta<typeof Number> = {
  component: Number,
};
export default meta;

type Story = StoryObj<typeof Number>;

const config = (args?: Story['args']) => ({
  storyName: '',
  args: {
    label: 'Label',
    value: 3,
    ...args,
  },
  render: props => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (
      <Number {...props} value={value} onChange={setValue} width={80} />
    );
  },
} satisfies Story);

export const NumberUIStates: Story = createStorybookComponentStates({ ...config(), includeError: true });
NumberUIStates.storyName = 'UI States (Default)';

export const CountUIStates: Story = createStorybookComponentStates({ ...config({ type: 'count' }), includeError: true });
CountUIStates.storyName = 'UI States (Count)';

export const CurrencyUIStates: Story = createStorybookComponentStates({ ...config({ type: 'currency' }), includeError: true });
CurrencyUIStates.storyName = 'UI States (Currency)';

export const PercentUIStates: Story = createStorybookComponentStates({ ...config({ type: 'percent', allowDecimals: 3 }), includeError: true });
PercentUIStates.storyName = 'UI States (Percent)';
