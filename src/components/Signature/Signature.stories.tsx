import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { createStory } from '../../Storybook/createStory';
import { Signature } from './Signature';

const meta: Meta<typeof Signature> = {
  component: Signature,
};
export default meta;

type Story = StoryObj<typeof Signature>;

export const Default: Story = createStory<typeof Signature>({
  args: {},
  width: 400,
  height: 350,
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Signature
        label="Signature"
        value={value}
        onChange={setValue}
      />
    );
  },
});

export const WithClearButton: Story = createStory<typeof Signature>({
  args: {
    onChange: fn(),
  },
  width: 400,
  height: 350,
  render: props => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Signature
        label="Sign here"
        allowClear
        value={value}
        onChange={v => {
          setValue(v);
          (props.onChange as ((v: string | undefined) => void) | undefined)?.(v);
        }}
        assistiveHelp="Draw your signature above"
      />
    );
  },
});
