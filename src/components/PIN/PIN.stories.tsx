import { PIN } from './PIN';
import { Meta, StoryObj } from '@storybook/react';
import { useBound, useUpdatableState } from '../../hooks';
import { createStorybookComponentStates } from '../../Storybook';

const meta: Meta<typeof PIN> = {
  component: PIN,
  argTypes: {
    onChange: {
      action: 'onChange',
      type: 'function',
      table: {
        disable: true,
      },
    },
    onSubmit: {
      action: 'onSubmit',
      type: 'function',
      table: {
        disable: true,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PIN>;

const config = {
  args: {
    label: 'PIN',
    length: 5,
    value: '123',
  },
  render: props => {
    const [value, setValue] = useUpdatableState<string | undefined>(() => props.value, [props.value]);

    const saveValue = useBound((newValue: string | undefined) => {
      setValue(newValue);
      props.onChange?.(newValue);
    });

    return (
      <PIN {...props} value={value} onChange={saveValue} />
    );
  },
} satisfies Story;

export const UIStates = createStorybookComponentStates({ ...config, includeError: true });
