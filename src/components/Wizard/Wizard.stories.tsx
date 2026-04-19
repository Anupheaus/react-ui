import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect } from 'storybook/test';
import { useLayoutEffect, useState } from 'react';
import { Windows } from '../Windows/Windows';
import { StorybookComponent } from '../../Storybook/StorybookComponent2';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import { createWizard } from './createWizard';
import { createWizardStep } from './createWizardStep';
import { useWizard } from './useWizard';
import { useWizardStep } from './useWizardStep';

const meta: Meta = { component: null as never };
export default meta;
type Story = StoryObj;

// ── Inline steps (using Step util) ───────────────────────────────────────────

const InlineWizard = createWizard('InlineWizard', ({ Wizard, Step, Actions }) => () => (
  <Wizard title="Inline Step Wizard" width={500}>
    <Step id="intro"><p>Welcome! This is step one.</p></Step>
    <Step id="details"><p>Fill in your details here.</p></Step>
    <Step id="confirm"><p>Confirm and submit.</p></Step>
    <Actions />
  </Wizard>
));

const InlineStoryActions = createComponent('InlineStoryActions', () => {
  const { openInlineWizard } = useWizard(InlineWizard, 'inline-1');
  return <Button onClick={() => openInlineWizard()}>Open Inline Wizard</Button>;
});

export const InlineSteps: Story = {
  render() {
    return (
      <StorybookComponent width={900} height={600} title="Inline Steps">
        <Flex isVertical gap={8}>
          <InlineStoryActions />
          <Windows />
        </Flex>
      </StorybookComponent>
    );
  },
};

// ── External createWizardStep components ─────────────────────────────────────

const DetailsStep = createWizardStep('DetailsStep', ({ id, setNextIsEnabled }) => {
  setNextIsEnabled(false);
  return <p>Details step (id: {id}) — Next is disabled until you click below.</p>;
});

const ConfirmStep = createWizardStep('ConfirmStep', () => <p>Confirm step — ready to save.</p>);

const ExternalWizard = createWizard('ExternalWizard', ({ Wizard, Actions }) => () => (
  <Wizard title="External Step Wizard" width={500}>
    <DetailsStep />
    <ConfirmStep />
    <Actions />
  </Wizard>
));

const ExternalStoryActions = createComponent('ExternalStoryActions', () => {
  const { openExternalWizard } = useWizard(ExternalWizard, 'external-1');
  return <Button onClick={() => openExternalWizard()}>Open External Step Wizard</Button>;
});

export const ExternalSteps: Story = {
  render() {
    return (
      <StorybookComponent width={900} height={600} title="External createWizardStep">
        <Flex isVertical gap={8}>
          <ExternalStoryActions />
          <Windows />
        </Flex>
      </StorybookComponent>
    );
  },
};

// ── useWizardStep inside nested component ─────────────────────────────────────

const NestedContent = createComponent('NestedContent', () => {
  const { setNextIsEnabled, moveNext } = useWizardStep();
  return (
    <Flex isVertical gap={8}>
      <p>Nested component using useWizardStep.</p>
      <Button onClick={() => setNextIsEnabled(false)}>Disable Next</Button>
      <Button onClick={() => setNextIsEnabled(true)}>Enable Next</Button>
      <Button onClick={() => moveNext()}>Move Next manually</Button>
    </Flex>
  );
});

const HookWizard = createWizard('HookWizard', ({ Wizard, Step, Actions }) => () => (
  <Wizard title="useWizardStep Demo" width={500}>
    <Step id="one"><NestedContent /></Step>
    <Step id="two"><p>Step two.</p></Step>
    <Actions />
  </Wizard>
));

const HookStoryActions = createComponent('HookStoryActions', () => {
  const { openHookWizard } = useWizard(HookWizard, 'hook-1');
  return <Button onClick={() => openHookWizard()}>Open useWizardStep Demo</Button>;
});

export const UseWizardStepHook: Story = {
  render() {
    return (
      <StorybookComponent width={900} height={600} title="useWizardStep Hook">
        <Flex isVertical gap={8}>
          <HookStoryActions />
          <Windows />
        </Flex>
      </StorybookComponent>
    );
  },
};

// ── Controlled mode ───────────────────────────────────────────────────────────

const ControlledWizardDef = createWizard('ControlledWizard', ({ Wizard, Step, Actions }) =>
  (activeStep: string) => (
    <Wizard title="Controlled Wizard" width={500} step={activeStep}>
      <Step id="alpha"><p>Alpha step</p></Step>
      <Step id="beta"><p>Beta step</p></Step>
      <Actions />
    </Wizard>
  )
);

const ControlledStory = createComponent('ControlledStory', () => {
  const [, setStep] = useState('alpha');
  const { openControlledWizard } = useWizard(ControlledWizardDef, 'ctrl-1');

  useLayoutEffect(() => { openControlledWizard('alpha'); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex isVertical gap={8}>
      <Flex gap={8}>
        <Button onClick={() => setStep('alpha')}>Go to Alpha</Button>
        <Button onClick={() => setStep('beta')}>Go to Beta</Button>
      </Flex>
      <Windows />
    </Flex>
  );
});

export const ControlledMode: Story = {
  render() {
    return (
      <StorybookComponent width={900} height={600} title="Controlled Step">
        <ControlledStory />
      </StorybookComponent>
    );
  },
};

// ── Progress indicator ────────────────────────────────────────────────────────

const ProgressWizard = createWizard('ProgressWizard', ({ Wizard, Step, Actions }) => () => (
  <Wizard title="Setup Wizard" width={620} height={420} showProgress>
    <Step id="account" label="Account details">
      <p>Enter your account information here.</p>
    </Step>
    <Step id="prefs" label="Preferences">
      <p>Customise your preferences.</p>
    </Step>
    <Step id="review" label="Review">
      <p>Review and confirm your submission.</p>
    </Step>
    <Actions />
  </Wizard>
));

const ProgressStory = createComponent('ProgressStory', () => {
  const { openProgressWizard } = useWizard(ProgressWizard, 'progress-1');
  useLayoutEffect(() => { openProgressWizard(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <Windows />;
});

export const WithProgress: Story = {
  render() {
    return (
      <StorybookComponent width={900} height={600} title="Progress Indicator">
        <ProgressStory />
      </StorybookComponent>
    );
  },
  play: async ({ canvas, userEvent }) => {
    // Step labels are visible in the indicator panel
    await expect(canvas.getByText('Account details')).toBeInTheDocument();
    await expect(canvas.getByText('Preferences')).toBeInTheDocument();
    await expect(canvas.getByText('Review')).toBeInTheDocument();

    // On step 1 — only Next is shown, no Back
    const nextButton = canvas.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();

    // Advance to step 2
    await userEvent.click(nextButton);

    // Back is now visible; Next is still visible (middle step)
    await expect(canvas.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    // Click the completed step label to navigate back to step 1
    await userEvent.click(canvas.getByText('Account details'));

    // Back should be gone again (we're back on step 1)
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
  },
};
WithProgress.name = 'With Progress Indicator';
