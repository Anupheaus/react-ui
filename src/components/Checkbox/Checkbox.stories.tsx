import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { ComponentProps, ReactNode, useState } from 'react';
import { Checkbox } from './Checkbox';

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
  storyName: '',
  args: {
  },
  render: props => {
    const [value, setValue] = useState(false);
    return (
      <Checkbox {...props} value={value} onChange={setValue} labelPosition={labelPosition}>{children}</Checkbox>
    );
  },
}) satisfies Story;

export const UIStates = createStorybookComponentStates({ ...config(), includeError: true });
UIStates.storyName = 'UI States (Right Align)';

export const UIStatesLeftAlign = createStorybookComponentStates({ ...config({ labelPosition: 'left' }), includeError: true });
UIStatesLeftAlign.storyName = 'UI States (Left Align)';

export const UIStatesTopAlign = createStorybookComponentStates({ ...config({ labelPosition: 'top' }), includeError: true });
UIStatesTopAlign.storyName = 'UI States (Top Align)';

export const UIStatesBottomAlign = createStorybookComponentStates({ ...config({ labelPosition: 'bottom' }), includeError: true });
UIStatesBottomAlign.storyName = 'UI States (Bottom Align)';
