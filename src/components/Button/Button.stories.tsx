import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { createStorybookComponentStates } from '../../Storybook';
import { Icon } from '../Icon';
import { ComponentProps, ReactNode } from 'react';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

interface Props {
  isBusy?: boolean;
  children?: ReactNode;
  variant?: ComponentProps<typeof Button>['variant'];
}

const config = ({ children = 'Label', variant }: Props = {}) => ({
  storyName: '',
  args: {
  },
  render: props => {
    const doSomethingForever = () => new Promise<void>(() => void 0);

    return (
      <Button {...props} variant={variant} onSelect={doSomethingForever}>{children}</Button>
    );
  },
}) satisfies Story;

export const UIStates: Story = createStorybookComponentStates(config());
UIStates.storyName = 'UI States';

export const UIStatesWithIcon: Story = createStorybookComponentStates(config({ children: <><Icon name="drawer-close" />Label</> }));
UIStatesWithIcon.storyName = 'UI States with Icon';

export const UIStatesWithIconOnly: Story = createStorybookComponentStates(config({ children: <Icon name="drawer-close" /> }));
UIStatesWithIconOnly.storyName = 'UI States with Icon Only';

export const UIStatesAsBorderOnlyVariant: Story = createStorybookComponentStates(config({ variant: 'bordered' }));
UIStatesAsBorderOnlyVariant.storyName = 'UI States as Bordered Variant';

export const UIStatesAsBorderOnlyVariantWithIcon: Story = createStorybookComponentStates(config({ variant: 'bordered', children: <><Icon name="drawer-close" />Label</> }));
UIStatesAsBorderOnlyVariantWithIcon.storyName = 'UI States as Bordered Variant with Icon';

export const UIStatesAsBorderOnlyVariantWithIconOnly: Story = createStorybookComponentStates(config({ variant: 'bordered', children: <Icon name="drawer-close" /> }));
UIStatesAsBorderOnlyVariantWithIconOnly.storyName = 'UI States as Bordered Variant with Icon Only';

export const UIStatesAsHoverVariant: Story = createStorybookComponentStates(config({ variant: 'hover' }));
UIStatesAsHoverVariant.storyName = 'UI States as Hover Variant';

export const UIStatesAsHoverVariantWithIcon: Story = createStorybookComponentStates(config({ variant: 'hover', children: <><Icon name="drawer-close" />Label</> }));
UIStatesAsHoverVariantWithIcon.storyName = 'UI States as Hover Variant with Icon';

export const UIStatesAsHoverVariantWithIconOnly: Story = createStorybookComponentStates(config({ variant: 'hover', children: <Icon name="drawer-close" /> }));
UIStatesAsHoverVariantWithIconOnly.storyName = 'UI States as Hover Variant with Icon Only';
