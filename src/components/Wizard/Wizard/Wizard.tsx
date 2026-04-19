import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound, useDistributedState } from '../../../hooks';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { Tag } from '../../Tag';
import { Window } from '../../Windows/Window/Window';
import { WizardContext, WizardEnabledContext, WizardRegistrationContext, WizardStepIdContext } from '../WizardContexts';
import type { StepRecord, WizardProps } from '../WizardModels';
import { WizardStepContent } from './WizardStepContent';
import { WizardStepIndicator } from './WizardStepIndicator';

const useStyles = createStyles({
  hidden: {
    display: 'none',
  },
  wizardLayout: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
  },
  wizardRight: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  wizardSteps: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    flexGrow: 1,
    overflow: 'hidden',
  },
});

const isStep = (child: React.ReactElement) => !!(child.type as any).__isWizardStep;

export const Wizard = createComponent('Wizard', ({
  className,
  title,
  icon,
  step: providedStep,
  onStepChange,
  showProgress,
  hideCloseButton,
  allowMaximizeButton = false,
  disableDrag,
  disableResize,
  width,
  height,
  minWidth,
  minHeight,
  isLoading,
  children,
  onClosing,
  onClosed,
  onFocus,
  navigationRef,
}: WizardProps) => {
  const { css } = useStyles();
  const { state, set, get } = useDistributedState<string>(() => providedStep ?? '');
  const [steps, setSteps] = useState<StepRecord[]>([]);
  const [isNextEnabled, setIsNextEnabled] = useState(true);
  const [isBackEnabled, setIsBackEnabled] = useState(true);

  // Stable refs to avoid stale closures inside useBound callbacks
  const stepsRef = useRef<StepRecord[]>([]);
  stepsRef.current = steps;
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  // Sync controlled mode when step prop changes
  useLayoutEffect(() => {
    if (providedStep != null && onStepChange != null) set(providedStep);
  }, [providedStep]); // intentional: stable refs/bound fns excluded

  // When steps first register, set initial active step if none is set
  useLayoutEffect(() => {
    if (steps.length > 0 && !get()) set(steps[0].id);
  }, [steps]); // intentional: stable refs/bound fns excluded

  const moveNext = useBound(() => {
    const currentId = get();
    const currentIndex = stepsRef.current.findIndex(s => s.id === currentId);
    if (currentIndex < stepsRef.current.length - 1) {
      const nextId = stepsRef.current[currentIndex + 1].id;
      set(nextId);
      onStepChangeRef.current?.(nextId);
    }
  });

  const moveBack = useBound(() => {
    const currentId = get();
    const currentIndex = stepsRef.current.findIndex(s => s.id === currentId);
    if (currentIndex > 0) {
      const prevId = stepsRef.current[currentIndex - 1].id;
      set(prevId);
      onStepChangeRef.current?.(prevId);
    }
  });

  const navigateTo = useBound((stepId: string) => {
    set(stepId);
    onStepChangeRef.current?.(stepId);
  });

  const handleSetNextIsEnabled = useBound((enabled: boolean) => setIsNextEnabled(enabled));
  const handleSetBackIsEnabled = useBound((enabled: boolean) => setIsBackEnabled(enabled));

  useLayoutEffect(() => {
    if (navigationRef == null) return;
    navigationRef.current = { moveNext, moveBack, setNextIsEnabled: handleSetNextIsEnabled, setBackIsEnabled: handleSetBackIsEnabled };
  });

  const upsertStep = useBound((record: StepRecord) => setSteps(prev => {
    const idx = prev.findIndex(s => s.id === record.id);
    if (idx === -1) return [...prev, record];
    const copy = [...prev];
    copy[idx] = record;
    return copy;
  }));

  const removeStep = useBound((id: string) => setSteps(prev => {
    const filtered = prev.filter(s => s.id !== id);
    if (get() === id && filtered.length > 0) set(filtered[0].id);
    return filtered;
  }));

  const registrationContext = useMemo(() => ({ isValid: true, upsertStep, removeStep }), []); // intentional: stable refs/bound fns excluded

  type StepValidator = { isValid: () => boolean; highlight: () => void };
  const stepValidatorsRef = useRef(new Map<string, StepValidator>());

  const registerStepValidator = useBound((stepId: string, isValid: () => boolean, highlight: () => void) => {
    stepValidatorsRef.current.set(stepId, { isValid, highlight });
    return () => { stepValidatorsRef.current.delete(stepId); };
  });

  const checkStepIsValid = useBound((stepId: string) => {
    const v = stepValidatorsRef.current.get(stepId);
    if (v == null) return true;
    v.highlight();
    return v.isValid();
  });

  const wizardContext = useMemo(() => ({
    state, steps,
    moveNext, moveBack, navigateTo,
    setNextIsEnabled: handleSetNextIsEnabled,
    setBackIsEnabled: handleSetBackIsEnabled,
    registerStepValidator,
    checkStepIsValid,
  }), [state, steps]); // intentional: stable refs/bound fns excluded

  const wizardEnabledContext = useMemo(() => ({
    isNextEnabled,
    isBackEnabled,
  }), [isNextEnabled, isBackEnabled]);

  const slotIds = useRef<string[]>([]);

  const wrappedStepChildren = useMemo(() => {
    const all = React.Children.toArray(children);
    const stepKids = all.filter(c => React.isValidElement(c) && isStep(c)) as React.ReactElement[];
    return stepKids.map((child, index) => {
      const propId = (child.props as { id?: string }).id;
      if (slotIds.current[index] == null) slotIds.current[index] = propId ?? `wizard-step-${index}`;
      const id = propId ?? slotIds.current[index];
      return (
        <WizardStepIdContext.Provider key={id} value={{ id }}>
          {child}
        </WizardStepIdContext.Provider>
      );
    });
  }, [children]);

  const otherChildren = useMemo(() => {
    const all = React.Children.toArray(children);
    return all.filter(c => !React.isValidElement(c) || !isStep(c));
  }, [children]);

  const renderedSteps = useMemo(() => steps.map(step => (
    <WizardStepContent key={step.id} stepId={step.id} onStep={step.onStep}>
      {step.children}
    </WizardStepContent>
  )), [steps]);

  return (
    <Window
      title={title}
      icon={icon}
      className={className}
      hideCloseButton={hideCloseButton}
      hideMaximizeButton={!allowMaximizeButton}
      disableDrag={disableDrag}
      disableResize={disableResize}
      disableScrolling
      initialPosition="center"
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      isLoading={isLoading}
      onClosing={onClosing}
      onClosed={onClosed}
      onFocus={onFocus}
    >
      <WizardContext.Provider value={wizardContext}>
        <WizardEnabledContext.Provider value={wizardEnabledContext}>
          <WizardRegistrationContext.Provider value={registrationContext}>
            <Tag name="hidden" className={css.hidden}>
              {wrappedStepChildren}
            </Tag>
            <div className={css.wizardLayout}>
              {showProgress && <WizardStepIndicator />}
              <div className={css.wizardRight}>
                <Tag name="wizard-steps" className={css.wizardSteps}>
                  {renderedSteps}
                </Tag>
                {otherChildren}
              </div>
            </div>
          </WizardRegistrationContext.Provider>
        </WizardEnabledContext.Provider>
      </WizardContext.Provider>
    </Window>
  );
});
