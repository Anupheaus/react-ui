import { useContext } from 'react';
import { WizardContext } from './WizardContexts';
import type { WizardNavigationUtils } from './WizardModels';

export function useWizardStep(): WizardNavigationUtils {
  const { moveNext, moveBack, setNextIsEnabled, setBackIsEnabled, state } = useContext(WizardContext);

  if (state == null) {
    throw new Error('useWizardStep must be called from within a wizard step. Ensure the component is rendered inside a Wizard created with createWizard.');
  }

  return { moveNext, moveBack, setNextIsEnabled, setBackIsEnabled };
}
