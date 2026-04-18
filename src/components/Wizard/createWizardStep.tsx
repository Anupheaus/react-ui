import { useContext, useLayoutEffect, useRef } from 'react';
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
  const component = createComponent(name, ({ id: providedId }: { id?: string }) => {
    const { id: contextId } = useContext(WizardStepIdContext);
    const generatedId = useId();
    const id = providedId ?? (contextId || generatedId);

    const { moveNext, moveBack, setNextIsEnabled: ctxSetNext, setBackIsEnabled: ctxSetBack } = useContext(WizardContext);

    // Capture setNextIsEnabled/setBackIsEnabled calls made during the definition render
    // and apply them after render to avoid "setState during render" warnings.
    const nextEnabledCapture = useRef<boolean | undefined>(undefined);
    const backEnabledCapture = useRef<boolean | undefined>(undefined);

    const captureSetNext = (v: boolean) => { nextEnabledCapture.current = v; };
    const captureSetBack = (v: boolean) => { backEnabledCapture.current = v; };

    useLayoutEffect(() => {
      if (nextEnabledCapture.current !== undefined) {
        ctxSetNext(nextEnabledCapture.current);
        nextEnabledCapture.current = undefined;
      }
      if (backEnabledCapture.current !== undefined) {
        ctxSetBack(backEnabledCapture.current);
        backEnabledCapture.current = undefined;
      }
    });

    const content = definition({ id, moveNext, moveBack, setNextIsEnabled: captureSetNext, setBackIsEnabled: captureSetBack });

    return <WizardStep id={id}>{content}</WizardStep>;
  });

  (component as any).__isWizardStep = true;
  return component;
}
