import { useContext, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useId } from '../../hooks';
import { createComponent } from '../Component';
import { WizardContext, WizardStepIdContext } from './WizardContexts';
import type { WizardStepDefinitionUtils } from './WizardModels';
import { WizardStep } from './Wizard/WizardStep';

type StepDefinition = (utils: WizardStepDefinitionUtils) => JSX.Element | null;

export function createWizardStep(
  name: string,
  definition: StepDefinition,
) {
  const component = createComponent(name, ({ id: providedId, label }: { id?: string; label?: ReactNode }) => {
    const { id: contextId } = useContext(WizardStepIdContext);
    const generatedId = useId();
    const id = providedId ?? (contextId || generatedId);

    const { moveNext, moveBack, setNextIsEnabled: ctxSetNext, setBackIsEnabled: ctxSetBack } = useContext(WizardContext);

    // true during every render, false after (reset by useLayoutEffect)
    const isRenderingRef = useRef(true);
    isRenderingRef.current = true;

    const nextEnabledCapture = useRef<boolean | undefined>(undefined);
    const backEnabledCapture = useRef<boolean | undefined>(undefined);

    const captureSetNext = (v: boolean) => {
      if (isRenderingRef.current) {
        nextEnabledCapture.current = v;
      } else {
        ctxSetNext(v);
      }
    };

    const captureSetBack = (v: boolean) => {
      if (isRenderingRef.current) {
        backEnabledCapture.current = v;
      } else {
        ctxSetBack(v);
      }
    };

    useLayoutEffect(() => {
      isRenderingRef.current = false;
      if (nextEnabledCapture.current !== undefined) {
        ctxSetNext(nextEnabledCapture.current);
        nextEnabledCapture.current = undefined;
      }
      if (backEnabledCapture.current !== undefined) {
        ctxSetBack(backEnabledCapture.current);
        backEnabledCapture.current = undefined;
      }
    });

    let onStepCallback: ((isActive: boolean) => void) | undefined;
    const onStep = (callback: (isActive: boolean) => void) => { onStepCallback = callback; };

    const content = definition({ id, moveNext, moveBack, setNextIsEnabled: captureSetNext, setBackIsEnabled: captureSetBack, onStep });

    return <WizardStep id={id} label={label} onStep={onStepCallback}>{content}</WizardStep>;
  });

  (component as any).__isWizardStep = true;
  return component;
}
