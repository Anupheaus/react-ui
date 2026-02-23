import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn } from 'storybook/test';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { Icon } from './Icon';
import type { ComponentProps } from 'react';

const meta: Meta<typeof Icon> = {
  component: Icon,
};
export default meta;

type Story = StoryObj<typeof Icon>;

const config = (additionalProps: Partial<ComponentProps<typeof Icon>> = {}): Story => ({
  args: {
    name: 'no-image',
    ...additionalProps,
  },
  render: (props: ComponentProps<typeof Icon>) => <Icon {...props} />,
});

export const Interactive: Story = {
  args: {
    name: 'drawer-close',
    onClick: fn(),
  },
  render: props => <div data-testid="clickable-icon"><Icon {...props} /></div>,
  play: async ({ canvas, userEvent, args }) => {
    const icon = canvas.getByTestId('clickable-icon').querySelector('[data-icon-type="drawer-close"]') ?? canvas.getByTestId('clickable-icon');
    await userEvent.click(icon as HTMLElement);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
Interactive.name = 'Interactive';

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStatesSmall: Story = createStorybookComponentStates(config({ size: 'small' }));
UIStatesSmall.name = 'UI States (Small)';
UIStatesSmall.play = waitForStoryReady;

export const UIStatesNormal: Story = createStorybookComponentStates(config({ size: 'normal' }));
UIStatesNormal.name = 'UI States (Normal)';
UIStatesNormal.play = waitForStoryReady;

export const UIStatesLarge: Story = createStorybookComponentStates(config({ size: 'large' }));
UIStatesLarge.name = 'UI States (Large)';
UIStatesLarge.play = waitForStoryReady;

export const UIStatesAndIsClickable: Story = createStorybookComponentStates(config({ onClick: () => void 0 }));
UIStatesAndIsClickable.name = 'UI States (Clickable)';
UIStatesAndIsClickable.play = waitForStoryReady;
