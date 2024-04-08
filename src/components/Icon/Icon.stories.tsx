import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { Icon } from './Icon';
import { ComponentProps } from 'react';

const meta: Meta<typeof Icon> = {
  component: Icon,
};
export default meta;

type Story = StoryObj<typeof Icon>;

const config = (additionalProps: Partial<ComponentProps<typeof Icon>> = {}): any => ({
  storyName: '',
  args: {
    name: 'no-image',
    ...additionalProps,
  },
  render: props => (
    <Icon {...props} />
  ),
}) as Story;

export const UIStatesSmall: Story = createStorybookComponentStates(config({ size: 'small' }));
UIStatesSmall.storyName = 'UI States (Small)';

export const UIStatesNormal: Story = createStorybookComponentStates(config({ size: 'normal' }));
UIStatesNormal.storyName = 'UI States (Normal)';

export const UIStatesLarge: Story = createStorybookComponentStates(config({ size: 'large' }));
UIStatesLarge.storyName = 'UI States (Large)';

export const UIStatesAndIsClickable: Story = createStorybookComponentStates(config({ onClick: () => void 0 }));
UIStatesAndIsClickable.storyName = 'UI States (Clickable)';
