import type { Meta, StoryObj } from '@storybook/react-webpack5';
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
