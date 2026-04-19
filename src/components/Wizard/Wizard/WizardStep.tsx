import { useContext, useEffect, useLayoutEffect } from 'react';
import { useId } from '../../../hooks';
import { createComponent } from '../../Component';
import { WizardRegistrationContext, WizardStepIdContext } from '../WizardContexts';
import type { WizardStepProps } from '../WizardModels';

export const WizardStep = createComponent('WizardStep', ({ id: providedId, label, onStep, children }: WizardStepProps) => {
  const { id: contextId } = useContext(WizardStepIdContext);
  const generatedId = useId();
  const id = providedId ?? (contextId || generatedId);
  const { isValid, upsertStep, removeStep } = useContext(WizardRegistrationContext);

  if (!isValid) throw new Error('WizardStep must be a child of Wizard');

  useLayoutEffect(() => {
    upsertStep({ id, label, onStep, children });
  }, [id, label, onStep, children, upsertStep]);

  useEffect(() => () => { removeStep(id); }, [id, removeStep]);

  return null;
});

// Marker used by Wizard to identify step children vs non-step children (e.g. Actions)
(WizardStep as any).__isWizardStep = true;
