import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { useUpdatableState } from '../../hooks';
import { Radio } from './Radio';
import { ListItem } from '@anupheaus/common';
import { ComponentProps } from 'react';

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
  storyName: '',
  args: {
    label: 'Label',
    value: 'Hey'
  },
  render: props => {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (
      <Radio {...props} {...additionalProps} value={value} onChange={setValue} values={options} />
    );
  },
});

export const UIStates = createStorybookComponentStates({ ...config(), includeError: true });
UIStates.storyName = 'UI States';

export const UIStatesHorizontal = createStorybookComponentStates({ ...config({ isHorizontal: true }), includeError: true });
UIStatesHorizontal.storyName = 'UI States (Horizontal)';