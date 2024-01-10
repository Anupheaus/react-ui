import { PIN } from './PIN';
import { Meta, StoryObj } from '@storybook/react';
import { useBound, useUpdatableState } from '../../hooks';
import { createStorybookComponentStates } from '../../Storybook';
import { ComponentProps } from 'react';

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

const config = (additionalProps: Partial<ComponentProps<typeof PIN>> = {}): Story => ({
  args: {
    label: 'PIN',
    length: 5,
    value: '123',
  },
  render: props => {
    const [value, setValue] = useUpdatableState<string>(() => props.value ?? '', [props.value]);

    const saveValue = useBound((newValue: string) => {
      setValue(newValue);
      props.onChange?.(newValue);
    });

    return (
      <PIN {...props} {...additionalProps} value={value} onChange={saveValue} />
    );
  },
});

export const UIStates = createStorybookComponentStates({ ...config(), includeError: true });
export const UIStatesNotCensored = createStorybookComponentStates({ ...config({ isCensored: false }), includeError: true });
