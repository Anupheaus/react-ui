import React from 'react';
import { render } from '@testing-library/react';
import { WizardStep } from './Wizard/WizardStep';
import { WizardStepContent } from './Wizard/WizardStepContent';
import { WizardContext } from './WizardContexts';
import { useDistributedState } from '../../hooks';
import type { WizardContextProps } from './WizardModels';

// jsdom does not implement IntersectionObserver; stub it so Scroller mounts without errors
class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

describe('WizardStep', () => {
  it('throws when rendered outside a Wizard', () => {
    expect(() => render(<WizardStep>content</WizardStep>)).toThrow('WizardStep must be a child of Wizard');
  });
});

// Wrapper that creates a real DistributedState and provides it via context
interface WizardStepContentHarnessProps {
  initialStepId: string;
  stepIds: string[];
  targetStepId: string;
  children?: React.ReactNode;
}

function WizardStepContentHarness({ initialStepId, stepIds, targetStepId, children }: WizardStepContentHarnessProps) {
  const { state, set } = useDistributedState(() => initialStepId);

  const contextValue: WizardContextProps = {
    state,
    steps: stepIds.map(id => ({ id, children: null })),
    isNextEnabled: true,
    isBackEnabled: true,
    moveNext: () => void 0,
    moveBack: () => void 0,
    setNextIsEnabled: () => void 0,
    setBackIsEnabled: () => void 0,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      <WizardStepContent stepId={targetStepId}>
        {children ?? 'step content'}
      </WizardStepContent>
    </WizardContext.Provider>
  );
}

describe('WizardStepContent', () => {
  it('is visible when it matches the active step id', () => {
    const { container } = render(
      <WizardStepContentHarness initialStepId="step-1" stepIds={['step-1', 'step-2']} targetStepId="step-1" />
    );
    expect(container.querySelector('.is-visible')).not.toBeNull();
  });

  it('is hidden when it does not match the active step id', () => {
    const { container } = render(
      <WizardStepContentHarness initialStepId="step-2" stepIds={['step-1', 'step-2']} targetStepId="step-1" />
    );
    expect(container.querySelector('.is-visible')).toBeNull();
  });
});
