import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useUpdatableState } from '../../hooks';
import { Radio } from './Radio';
import { ListItem } from '@anupheaus/common';
import type { ComponentProps } from 'react';

const meta: Meta<typeof Radio> = {
  component: Radio,
};
export default meta;

type Story = StoryObj<typeof Radio>;

const options: ListItem[] = [
  { id: '1', text: 'One' },
  { id: '2', text: 'Two' },
  { id: '3', text: 'Three' },
  { id: '4', text: 'Four' },
  { id: '5', text: 'Five' },
  { id: '6', text: 'Six' },
];

const config = (additionalProps: Partial<ComponentProps<typeof Radio>> = {}): Story => ({
  args: {
    label: 'Label',
    value: 'Hey',
  },
  render: (props: ComponentProps<typeof Radio>) => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);
    return (
      <Radio {...props} {...additionalProps} value={value} onChange={setValue} values={options} />
    );
  },
});

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config(), includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

export const UIStatesHorizontal: Story = createStorybookComponentStates({ ...config({ isHorizontal: true }), includeError: true });
UIStatesHorizontal.name = 'UI States (Horizontal)';
UIStatesHorizontal.play = waitForStoryReady;
