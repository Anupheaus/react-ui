import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn } from 'storybook/test';
import { Button } from './Button';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { Icon } from '../Icon';
import { UIState } from '../../providers/UIStateProvider';
import type { ComponentProps, ReactNode } from 'react';

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
  args: {},
  render: (props: ComponentProps<typeof Button>) => {
    const doSomethingForever = () => new Promise<void>(() => void 0);

    return (
      <Button {...props} variant={variant} onSelect={doSomethingForever}>
        {children}
      </Button>
    );
  },
}) satisfies Story;

export const Interactive: Story = {
  args: {
    onClick: fn(),
  },
  render: props => <Button {...props}>Click me</Button>,
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
Interactive.name = 'Interactive';

export const ReadOnlyDoesNotCallOnClick: Story = {
  args: {
    onClick: fn(),
  },
  render: props => (
    <UIState isReadOnly>
      <Button {...props}>Read-only button</Button>
    </UIState>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: /read-only button/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(0);
  },
};
ReadOnlyDoesNotCallOnClick.name = 'Read-only does not call onClick';

export const LoadingDoesNotCallOnClick: Story = {
  args: {
    onClick: fn(),
  },
  render: props => (
    <UIState isLoading>
      <Button {...props} testId="loading-button">Loading button</Button>
    </UIState>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByTestId('loading-button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(0);
  },
};
LoadingDoesNotCallOnClick.name = 'Loading does not call onClick';

export const LoadingReadOnlyDoesNotCallOnClick: Story = {
  args: {
    onClick: fn(),
  },
  render: props => (
    <UIState isLoading isReadOnly>
      <Button {...props} testId="loading-readonly-button">Loading read-only button</Button>
    </UIState>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByTestId('loading-readonly-button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(0);
  },
};
LoadingReadOnlyDoesNotCallOnClick.name = 'Loading + Read-only does not call onClick';

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates(config());
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

export const UIStatesWithIcon: Story = createStorybookComponentStates(
  config({ children: <><Icon name="drawer-close" />Label</> })
);
UIStatesWithIcon.name = 'UI States with Icon';
UIStatesWithIcon.play = waitForStoryReady;

export const UIStatesWithIconOnly: Story = createStorybookComponentStates(
  config({ children: <Icon name="drawer-close" /> })
);
UIStatesWithIconOnly.name = 'UI States with Icon Only';
UIStatesWithIconOnly.play = waitForStoryReady;

export const UIStatesAsBorderOnlyVariant: Story = createStorybookComponentStates(
  config({ variant: 'bordered' })
);
UIStatesAsBorderOnlyVariant.name = 'UI States as Bordered Variant';
UIStatesAsBorderOnlyVariant.play = waitForStoryReady;

export const UIStatesAsBorderOnlyVariantWithIcon: Story = createStorybookComponentStates(
  config({ variant: 'bordered', children: <><Icon name="drawer-close" />Label</> })
);
UIStatesAsBorderOnlyVariantWithIcon.name = 'UI States as Bordered Variant with Icon';
UIStatesAsBorderOnlyVariantWithIcon.play = waitForStoryReady;

export const UIStatesAsBorderOnlyVariantWithIconOnly: Story = createStorybookComponentStates(
  config({ variant: 'bordered', children: <Icon name="drawer-close" /> })
);
UIStatesAsBorderOnlyVariantWithIconOnly.name = 'UI States as Bordered Variant with Icon Only';
UIStatesAsBorderOnlyVariantWithIconOnly.play = waitForStoryReady;

export const UIStatesAsHoverVariant: Story = createStorybookComponentStates(
  config({ variant: 'hover' })
);
UIStatesAsHoverVariant.name = 'UI States as Hover Variant';
UIStatesAsHoverVariant.play = waitForStoryReady;

export const UIStatesAsHoverVariantWithIcon: Story = createStorybookComponentStates(
  config({ variant: 'hover', children: <><Icon name="drawer-close" />Label</> })
);
UIStatesAsHoverVariantWithIcon.name = 'UI States as Hover Variant with Icon';
UIStatesAsHoverVariantWithIcon.play = waitForStoryReady;

export const UIStatesAsHoverVariantWithIconOnly: Story = createStorybookComponentStates(
  config({ variant: 'hover', children: <Icon name="drawer-close" /> })
);
UIStatesAsHoverVariantWithIconOnly.name = 'UI States as Hover Variant with Icon Only';
UIStatesAsHoverVariantWithIconOnly.play = waitForStoryReady;
