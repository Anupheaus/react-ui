import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { Avatar } from './Avatar';
import { ComponentProps } from 'react';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

type Props = ComponentProps<typeof Avatar>;

const config = (props: Props) => ({
  storyName: '',
  args: {
  },
  render: () => {
    return (
      <Avatar {...props} />
    );
  },
}) satisfies Story;

export const UIStatesSmall: Story = createStorybookComponentStates(config({ size: 'small' }));
UIStatesSmall.storyName = 'UI States (small)';

export const UIStatesMedium: Story = createStorybookComponentStates(config({ size: 'medium' }));
UIStatesMedium.storyName = 'UI States (medium)';

export const UIStatesLarge: Story = createStorybookComponentStates(config({ size: 'large' }));
UIStatesLarge.storyName = 'UI States (large)';

export const UIStatesWithGravatarSmall: Story = createStorybookComponentStates(config({ emailAddress: 'jitewaboh@lagify.com', initials: 'JW', size: 'small' }));
UIStatesWithGravatarSmall.storyName = 'UI States with Gravatar (small)';

export const UIStatesWithGravatarMedium: Story = createStorybookComponentStates(config({ emailAddress: 'jitewaboh@lagify.com', initials: 'JW', size: 'medium' }));
UIStatesWithGravatarMedium.storyName = 'UI States with Gravatar (medium)';

export const UIStatesWithGravatarLarge: Story = createStorybookComponentStates(config({ emailAddress: 'jitewaboh@lagify.com', initials: 'JW', size: 'large' }));
UIStatesWithGravatarLarge.storyName = 'UI States with Gravatar (large)';

export const UIStatesWithInitialsSmall: Story = createStorybookComponentStates(config({ initials: 'JW', size: 'small' }));
UIStatesWithInitialsSmall.storyName = 'UI States with Initials (small)';

export const UIStatesWithInitialsMedium: Story = createStorybookComponentStates(config({ initials: 'JW', size: 'medium' }));
UIStatesWithInitialsMedium.storyName = 'UI States with Initials (medium)';

export const UIStatesWithInitialsLarge: Story = createStorybookComponentStates(config({ initials: 'JW', size: 'large' }));
UIStatesWithInitialsLarge.storyName = 'UI States with Initials (large)';

export const UIStatesWithDisplayNameSmall: Story = createStorybookComponentStates(config({ displayName: 'Edgar Hoover', size: 'small' }));
UIStatesWithInitialsSmall.storyName = 'UI States with Display Name (small)';

export const UIStatesWithDisplayNameMedium: Story = createStorybookComponentStates(config({ displayName: 'Edgar Hoover', size: 'medium' }));
UIStatesWithInitialsMedium.storyName = 'UI States with Display Name (medium)';

export const UIStatesWithDisplayNameLarge: Story = createStorybookComponentStates(config({ displayName: 'Edgar Hoover', size: 'large' }));
UIStatesWithInitialsLarge.storyName = 'UI States with Display Name (large)';