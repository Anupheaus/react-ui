import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useUpdatableState } from '../../hooks';
import { Number } from './Number';

const meta: Meta<typeof Number> = {
  component: Number,
};
export default meta;

type Story = StoryObj<typeof Number>;

const config = (args?: Story['args']) => ({
  args: {
    label: 'Label',
    value: 3,
    ...args,
  },
  render: (props: React.ComponentProps<typeof Number>) => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);
    return (
      <Number {...props} value={value} onChange={setValue} width={80} />
    );
  },
}) satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const NumberUIStates: Story = createStorybookComponentStates({ ...config(), includeError: true });
NumberUIStates.name = 'UI States (Default)';
NumberUIStates.play = waitForStoryReady;

export const CountUIStates: Story = createStorybookComponentStates({ ...config({ type: 'count' }), includeError: true });
CountUIStates.name = 'UI States (Count)';
CountUIStates.play = waitForStoryReady;

export const CurrencyUIStates: Story = createStorybookComponentStates({ ...config({ type: 'currency' }), includeError: true });
CurrencyUIStates.name = 'UI States (Currency)';
CurrencyUIStates.play = waitForStoryReady;

export const PercentUIStates: Story = createStorybookComponentStates({ ...config({ type: 'percent', allowDecimals: 3 }), includeError: true });
PercentUIStates.name = 'UI States (Percent)';
PercentUIStates.play = waitForStoryReady;
