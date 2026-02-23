import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PIN } from './PIN';
import { useBound, useUpdatableState } from '../../hooks';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import type { ComponentProps } from 'react';

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
  render: (props: ComponentProps<typeof PIN>) => {
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

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config(), includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

export const UIStatesNotCensored: Story = createStorybookComponentStates({ ...config({ isCensored: false }), includeError: true });
UIStatesNotCensored.name = 'UI States (Not Censored)';
UIStatesNotCensored.play = waitForStoryReady;
