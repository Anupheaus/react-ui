import React, { useLayoutEffect } from 'react';
import { act, fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { WizardStep } from './Wizard/WizardStep';
import { WizardStepContent } from './Wizard/WizardStepContent';
import { WizardActions } from './Wizard/WizardActions';
import { Wizard } from './Wizard/Wizard';
import { createWizardStep } from './createWizardStep';
import { WizardContext, WizardEnabledContext } from './WizardContexts';
import { useDistributedState } from '../../hooks';
import type { WizardContextProps, WizardEnabledContextProps, WizardNavigationUtils } from './WizardModels';
import { WindowRenderContext } from '../Windows/WindowsContexts';
import { WindowsManager } from '../Windows/WindowsManager';
import type { DistributedState } from '../../hooks';

// jsdom does not implement IntersectionObserver; stub it so Scroller mounts without errors
class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

// ─── Shared module-level setup ────────────────────────────────────────────────

const WIZARD_MANAGER_ID = 'wizard-test-manager';
const WIZARD_MANAGER_INSTANCE = 'wizard-test-instance';
const wizardRenderContext = { id: 'w1', managerId: WIZARD_MANAGER_ID };

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  const manager = WindowsManager.getOrCreate(WIZARD_MANAGER_ID, WIZARD_MANAGER_INSTANCE, 'windows');
  // open() synchronously registers the window in the manager (only awaiting resolves the animation event)
  manager.open({ id: 'w1', definitionId: 'wizard-test', args: [] });
});

afterAll(() => {
  WindowsManager.remove(WIZARD_MANAGER_ID);
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
  setRef?: React.MutableRefObject<(id: string) => void>;
}

function WizardStepContentHarness({ initialStepId, stepIds, targetStepId, children, setRef }: WizardStepContentHarnessProps) {
  const { state, set } = useDistributedState(() => initialStepId);

  useLayoutEffect(() => {
    if (setRef) setRef.current = set;
  });

  const contextValue: WizardContextProps = {
    state,
    steps: stepIds.map(id => ({ id, children: null })),
    moveNext: () => void 0,
    moveBack: () => void 0,
    navigateTo: () => void 0,
    setNextIsEnabled: () => void 0,
    setBackIsEnabled: () => void 0,
    registerStepValidator: () => () => void 0,
    checkStepIsValid: () => true,
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

  it('becomes visible when state changes to its step id', () => {
    const setRef = React.createRef<(id: string) => void>() as React.MutableRefObject<(id: string) => void>;
    setRef.current = () => void 0;
    const { container } = render(
      <WizardStepContentHarness initialStepId="step-2" stepIds={['step-1', 'step-2']} targetStepId="step-1" setRef={setRef} />
    );
    expect(container.querySelector('.is-visible')).toBeNull();
    act(() => setRef.current('step-1'));
    expect(container.querySelector('.is-visible')).not.toBeNull();
  });
});

// ─── WizardActions ────────────────────────────────────────────────────────────

const TEST_MANAGER_ID = 'dialogs-default';
const TEST_MANAGER_INSTANCE = 'wizard-actions-test-instance';

interface RenderWizardActionsOptions {
  activeStepId: string;
  stepIds: string[];
  moveNext?: () => void;
  moveBack?: () => void;
  isNextEnabled?: boolean;
  isBackEnabled?: boolean;
}

function renderWizardActions({ activeStepId, stepIds, moveNext = () => void 0, moveBack = () => void 0, isNextEnabled = true, isBackEnabled = true }: RenderWizardActionsOptions) {
  let capturedState: DistributedState<string> | undefined;

  function StateCapture() {
    const { state } = useDistributedState<string>(() => activeStepId);
    capturedState = state;
    return null;
  }

  render(<StateCapture />);

  const contextValue: WizardContextProps = {
    state: capturedState!,
    steps: stepIds.map(id => ({ id, children: null })),
    moveNext,
    moveBack,
    navigateTo: () => void 0,
    setNextIsEnabled: () => void 0,
    setBackIsEnabled: () => void 0,
    registerStepValidator: () => () => void 0,
    checkStepIsValid: () => true,
  };

  const enabledContextValue: WizardEnabledContextProps = { isNextEnabled, isBackEnabled };

  const renderContext = { id: 'w1', managerId: TEST_MANAGER_ID };

  return render(
    <WizardContext.Provider value={contextValue}>
      <WizardEnabledContext.Provider value={enabledContextValue}>
        <WindowRenderContext.Provider value={renderContext}>
          <WizardActions />
        </WindowRenderContext.Provider>
      </WizardEnabledContext.Provider>
    </WizardContext.Provider>
  );
}

describe('WizardActions', () => {
  beforeAll(() => {
    WindowsManager.getOrCreate(TEST_MANAGER_ID, TEST_MANAGER_INSTANCE, 'dialogs');
  });

  afterAll(() => {
    WindowsManager.remove(TEST_MANAGER_ID);
  });

  it('shows only Save on a single step', () => {
    const { queryByText } = renderWizardActions({ activeStepId: 's1', stepIds: ['s1'] });
    expect(queryByText('Back')).toBeNull();
    expect(queryByText('Next')).toBeNull();
    expect(queryByText('Save')).not.toBeNull();
  });

  it('shows Next (no Back, no Save) on the first of multiple steps', () => {
    const { queryByText } = renderWizardActions({ activeStepId: 's1', stepIds: ['s1', 's2'] });
    expect(queryByText('Back')).toBeNull();
    expect(queryByText('Next')).not.toBeNull();
    expect(queryByText('Save')).toBeNull();
  });

  it('shows Back and Save (no Next) on the last step', () => {
    const { queryByText } = renderWizardActions({ activeStepId: 's2', stepIds: ['s1', 's2'] });
    expect(queryByText('Back')).not.toBeNull();
    expect(queryByText('Next')).toBeNull();
    expect(queryByText('Save')).not.toBeNull();
  });

  it('shows Back and Next (no Save) on a middle step', () => {
    const { queryByText } = renderWizardActions({ activeStepId: 's2', stepIds: ['s1', 's2', 's3'] });
    expect(queryByText('Back')).not.toBeNull();
    expect(queryByText('Next')).not.toBeNull();
    expect(queryByText('Save')).toBeNull();
  });

  it('calls moveNext when Next button is clicked', () => {
    const moveNext = vi.fn();
    const { getByText } = renderWizardActions({ activeStepId: 's1', stepIds: ['s1', 's2'], moveNext });
    fireEvent.click(getByText('Next').closest('button')!);
    expect(moveNext).toHaveBeenCalled();
  });

  it('calls moveBack when Back button is clicked', () => {
    const moveBack = vi.fn();
    const { getByText } = renderWizardActions({ activeStepId: 's2', stepIds: ['s1', 's2'], moveBack });
    fireEvent.click(getByText('Back').closest('button')!);
    expect(moveBack).toHaveBeenCalled();
  });

  it('Next button is read-only when isNextEnabled is false', () => {
    const { getByText } = renderWizardActions({ activeStepId: 's1', stepIds: ['s1', 's2'], isNextEnabled: false });
    expect(getByText('Next').closest('button')!.classList.contains('is-read-only')).toBe(true);
  });

  it('Back button is read-only when isBackEnabled is false', () => {
    const { getByText } = renderWizardActions({ activeStepId: 's2', stepIds: ['s1', 's2'], isBackEnabled: false });
    expect(getByText('Back').closest('button')!.classList.contains('is-read-only')).toBe(true);
  });
});

// ─── Wizard ───────────────────────────────────────────────────────────────────

describe('Wizard', () => {

  it('registers steps from children and renders their content', async () => {
    const { findByText } = render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test">
          <WizardStep>Step One</WizardStep>
          <WizardStep>Step Two</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );
    expect(await findByText('Step One')).toBeTruthy();
  });

  it('navigates to the next step on moveNext', async () => {
    const navRef = { current: null as unknown as WizardNavigationUtils };

    render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test" navigationRef={navRef}>
          <WizardStep id="s1">Step One</WizardStep>
          <WizardStep id="s2">Step Two</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );

    await waitFor(() => expect(navRef.current).not.toBeNull());
    act(() => navRef.current.moveNext());

    await waitFor(() => {
      const visible = document.querySelector('.is-visible');
      expect(visible?.textContent).toContain('Step Two');
    });
  });

  it('respects default step prop (uncontrolled)', async () => {
    const { container } = render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test" step="s2">
          <WizardStep id="s1">Step One</WizardStep>
          <WizardStep id="s2">Step Two</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );
    await waitFor(() => {
      const visible = container.querySelector('.is-visible');
      expect(visible?.textContent).toContain('Step Two');
    });
  });

  it('calls onStepChange in controlled mode', async () => {
    const onStepChange = vi.fn();
    const navRef = { current: null as unknown as WizardNavigationUtils };

    render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test" step="s1" onStepChange={onStepChange} navigationRef={navRef}>
          <WizardStep id="s1">Step One</WizardStep>
          <WizardStep id="s2">Step Two</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );

    await waitFor(() => expect(navRef.current).not.toBeNull());
    act(() => navRef.current.moveNext());
    expect(onStepChange).toHaveBeenCalledWith('s2');
  });

  it('renders the progress indicator panel when showProgress is set', async () => {
    const { findByText } = render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test" showProgress>
          <WizardStep id="s1" label="Step Label One">Step One</WizardStep>
          <WizardStep id="s2" label="Step Label Two">Step Two</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );
    expect(await findByText('Step Label One')).toBeTruthy();
    expect(await findByText('Step Label Two')).toBeTruthy();
  });

  it('does not render step labels when showProgress is not set', async () => {
    const { queryByText } = render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test">
          <WizardStep id="s1" label="Hidden Label">Step One</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );
    await waitFor(() => {
      expect(queryByText('Hidden Label')).toBeNull();
    });
  });

  it('navigateTo jumps to the specified step', async () => {
    const navRef = { current: null as unknown as WizardNavigationUtils };

    render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test" navigationRef={navRef}>
          <WizardStep id="s1">Step One</WizardStep>
          <WizardStep id="s2">Step Two</WizardStep>
          <WizardStep id="s3">Step Three</WizardStep>
        </Wizard>
      </WindowRenderContext.Provider>
    );

    await waitFor(() => expect(navRef.current).not.toBeNull());
    act(() => navRef.current.moveNext());
    act(() => navRef.current.moveNext());

    await waitFor(() => {
      const visible = document.querySelector('.is-visible');
      expect(visible?.textContent).toContain('Step Three');
    });
  });


});

// ─── createWizardStep ─────────────────────────────────────────────────────────

describe('createWizardStep', () => {
  it('has __isWizardStep marker', () => {
    const MyStep = createWizardStep('MyStep', ({ id }) => <div>step-id-{id}</div>);
    expect((MyStep as any).__isWizardStep).toBe(true);
  });

  it('creates a component that registers and renders as a wizard step', async () => {
    const MyStep = createWizardStep('MyStep', ({ id }) => <div>step-id-{id}</div>);

    const navRef = { current: null as unknown as WizardNavigationUtils };
    const { findByText } = render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test" navigationRef={navRef}>
          <MyStep id="my-step" />
        </Wizard>
      </WindowRenderContext.Provider>
    );

    expect(await findByText('step-id-my-step')).toBeTruthy();
  });

  it('receives navigation utils in the definition', async () => {
    let capturedMoveNext: unknown;
    const MyStep = createWizardStep('MyStep', ({ moveNext }) => {
      capturedMoveNext = moveNext;
      return <div>step</div>;
    });

    render(
      <WindowRenderContext.Provider value={wizardRenderContext}>
        <Wizard title="Test">
          <MyStep />
        </Wizard>
      </WindowRenderContext.Provider>
    );

    await waitFor(() => expect(typeof capturedMoveNext).toBe('function'));
  });
});

// ─── createWizard ─────────────────────────────────────────────────────────────

import { createWizard } from './createWizard';

describe('createWizard', () => {
  it('returns a component with the given name', () => {
    const MyWizard = createWizard('MyTestWizard', ({ Wizard, Step }) => () => (
      <Wizard title="Test Wizard">
        <Step id="s1"><div>step one</div></Step>
      </Wizard>
    ));
    expect(MyWizard.name).toBe('MyTestWizard');
  });
});

// ─── useWizard ────────────────────────────────────────────────────────────────

import { useWizard } from './useWizard';

describe('useWizard', () => {
  it('returns open/close methods named after the wizard', () => {
    const MyWizard = createWizard('MyHookWizard', ({ Wizard, Step }) => () => (
      <Wizard title="Hook Wizard"><Step id="s1"><div /></Step></Wizard>
    ));

    const { result } = renderHook(() => useWizard(MyWizard, 'hw-1'));
    expect(typeof result.current.openMyHookWizard).toBe('function');
    expect(typeof result.current.closeMyHookWizard).toBe('function');
  });
});

// ─── useWizardStep ────────────────────────────────────────────────────────────

import { useWizardStep } from './useWizardStep';

describe('useWizardStep', () => {
  it('throws when called outside a Wizard', () => {
    const { result } = renderHook(() => {
      try { return useWizardStep(); }
      catch (e) { return e as Error; }
    });
    expect((result.current as Error).message).toMatch(/useWizardStep.*Wizard/i);
  });

  it('returns navigation functions when called inside a WizardContext', () => {
    const contextValue: WizardContextProps = {
      state: {} as any, // non-null signals "inside a wizard"
      steps: [],
      moveNext: vi.fn(),
      moveBack: vi.fn(),
      navigateTo: vi.fn(),
      setNextIsEnabled: vi.fn(),
      setBackIsEnabled: vi.fn(),
      registerStepValidator: () => () => void 0,
      checkStepIsValid: () => true,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WizardContext.Provider value={contextValue}>{children}</WizardContext.Provider>
    );

    const { result } = renderHook(() => useWizardStep(), { wrapper });
    expect(typeof result.current.moveNext).toBe('function');
    expect(typeof result.current.setNextIsEnabled).toBe('function');
  });
});
