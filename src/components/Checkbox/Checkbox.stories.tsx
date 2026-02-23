import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn } from 'storybook/test';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { UIState } from '../../providers/UIStateProvider';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

interface Props {
  isBusy?: boolean;
  children?: ReactNode;
  labelPosition?: ComponentProps<typeof Checkbox>['labelPosition'];
}

const config = ({ children = 'Label', labelPosition }: Props = {}) => ({
  args: {},
  render: (props: ComponentProps<typeof Checkbox>) => {
    const [value, setValue] = useState(false);
    return (
      <Checkbox {...props} value={value} onChange={setValue} labelPosition={labelPosition}>
        {children}
      </Checkbox>
    );
  },
}) satisfies Story;

export const Interactive: Story = {
  args: {
    onChange: fn(),
  },
  render: props => {
    const [value, setValue] = useState(false);
    return (
      <Checkbox {...props} value={value} onChange={v => { setValue(v); (props.onChange as (v: boolean) => void)?.(v); }}>
        Toggle me
      </Checkbox>
    );
  },
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};
Interactive.name = 'Interactive';

export const ReadOnlyDoesNotCallOnChange: Story = {
  args: {
    onChange: fn(),
  },
  render: props => (
    <UIState isReadOnly>
      <Checkbox {...props} value={false} onChange={props.onChange as (v: boolean) => void}>
        Read-only checkbox
      </Checkbox>
    </UIState>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledTimes(0);
  },
};
ReadOnlyDoesNotCallOnChange.name = 'Read-only does not call onChange';

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config(), includeError: true });
UIStates.name = 'UI States (Right Align)';
UIStates.play = waitForStoryReady;

export const UIStatesLeftAlign: Story = createStorybookComponentStates({ ...config({ labelPosition: 'left' }), includeError: true });
UIStatesLeftAlign.name = 'UI States (Left Align)';
UIStatesLeftAlign.play = waitForStoryReady;

export const UIStatesTopAlign: Story = createStorybookComponentStates({ ...config({ labelPosition: 'top' }), includeError: true });
UIStatesTopAlign.name = 'UI States (Top Align)';
UIStatesTopAlign.play = waitForStoryReady;

export const UIStatesBottomAlign: Story = createStorybookComponentStates({ ...config({ labelPosition: 'bottom' }), includeError: true });
UIStatesBottomAlign.name = 'UI States (Bottom Align)';
UIStatesBottomAlign.play = waitForStoryReady;
