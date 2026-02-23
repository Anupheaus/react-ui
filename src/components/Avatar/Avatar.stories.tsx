import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { Avatar } from './Avatar';
import type { ComponentProps } from 'react';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

type Props = ComponentProps<typeof Avatar>;

const config = (props: Props) => ({
  args: {},
  render: () => <Avatar {...props} />,
}) satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStatesSmall: Story = createStorybookComponentStates(config({ size: 'small' }));
UIStatesSmall.name = 'UI States (small)';
UIStatesSmall.play = waitForStoryReady;

export const UIStatesMedium: Story = createStorybookComponentStates(config({ size: 'medium' }));
UIStatesMedium.name = 'UI States (medium)';
UIStatesMedium.play = waitForStoryReady;

export const UIStatesLarge: Story = createStorybookComponentStates(config({ size: 'large' }));
UIStatesLarge.name = 'UI States (large)';
UIStatesLarge.play = waitForStoryReady;

export const UIStatesWithGravatarSmall: Story = createStorybookComponentStates(config({ emailAddress: 'jitewaboh@lagify.com', initials: 'JW', size: 'small' }));
UIStatesWithGravatarSmall.name = 'UI States with Gravatar (small)';
UIStatesWithGravatarSmall.play = waitForStoryReady;

export const UIStatesWithGravatarMedium: Story = createStorybookComponentStates(config({ emailAddress: 'jitewaboh@lagify.com', initials: 'JW', size: 'medium' }));
UIStatesWithGravatarMedium.name = 'UI States with Gravatar (medium)';
UIStatesWithGravatarMedium.play = waitForStoryReady;

export const UIStatesWithGravatarLarge: Story = createStorybookComponentStates(config({ emailAddress: 'jitewaboh@lagify.com', initials: 'JW', size: 'large' }));
UIStatesWithGravatarLarge.name = 'UI States with Gravatar (large)';
UIStatesWithGravatarLarge.play = waitForStoryReady;

export const UIStatesWithInitialsSmall: Story = createStorybookComponentStates(config({ initials: 'JW', size: 'small' }));
UIStatesWithInitialsSmall.name = 'UI States with Initials (small)';
UIStatesWithInitialsSmall.play = waitForStoryReady;

export const UIStatesWithInitialsMedium: Story = createStorybookComponentStates(config({ initials: 'JW', size: 'medium' }));
UIStatesWithInitialsMedium.name = 'UI States with Initials (medium)';
UIStatesWithInitialsMedium.play = waitForStoryReady;

export const UIStatesWithInitialsLarge: Story = createStorybookComponentStates(config({ initials: 'JW', size: 'large' }));
UIStatesWithInitialsLarge.name = 'UI States with Initials (large)';
UIStatesWithInitialsLarge.play = waitForStoryReady;

export const UIStatesWithDisplayNameSmall: Story = createStorybookComponentStates(config({ displayName: 'Edgar Hoover', size: 'small' }));
UIStatesWithDisplayNameSmall.name = 'UI States with Display Name (small)';
UIStatesWithDisplayNameSmall.play = waitForStoryReady;

export const UIStatesWithDisplayNameMedium: Story = createStorybookComponentStates(config({ displayName: 'Edgar Hoover', size: 'medium' }));
UIStatesWithDisplayNameMedium.name = 'UI States with Display Name (medium)';
UIStatesWithDisplayNameMedium.play = waitForStoryReady;

export const UIStatesWithDisplayNameLarge: Story = createStorybookComponentStates(config({ displayName: 'Edgar Hoover', size: 'large' }));
UIStatesWithDisplayNameLarge.name = 'UI States with Display Name (large)';
UIStatesWithDisplayNameLarge.play = waitForStoryReady;
