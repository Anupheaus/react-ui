import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn } from 'storybook/test';
import { useState } from 'react';
import { createStory } from '../../Storybook/createStory';
import { Signature } from './Signature';

const meta: Meta<typeof Signature> = {
  component: Signature,
};
export default meta;

type Story = StoryObj<typeof Signature>;

export const Default: Story = createStory<typeof Signature>({
  args: {
    onChange: fn(),
    label: 'Signature',
  },
  width: 400,
  height: 350,
  render: props => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Signature
        {...props}
        value={value}
        onChange={v => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    );
  },
});

export const WithClearButton: Story = createStory<typeof Signature>({
  args: {
    onChange: fn(),
    label: 'Sign here',
    allowClear: true,
    assistiveHelp: 'Draw your signature above',
  },
  width: 400,
  height: 350,
  render: props => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Signature
        {...props}
        value={value}
        onChange={v => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    );
  },
});

WithClearButton.play = async ({ canvas, userEvent, args }) => {
  const clearButton = canvas.getByRole('button', { name: /clear/i });
  await userEvent.click(clearButton);
  await expect(args.onChange).toHaveBeenCalledWith(undefined);
};
