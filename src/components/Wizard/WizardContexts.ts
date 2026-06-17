// src/components/Wizard/WizardContexts.ts
import { createContext } from 'react';
import type { WizardContextProps, WizardEnabledContextProps, WizardRegistrationContextProps, WizardRenderModeContextProps, WizardStepIdContextProps } from './WizardModels';

export const WizardContext = createContext<WizardContextProps>({
  state: null as never,
  steps: [],
  moveNext: () => void 0,
  moveBack: () => void 0,
  navigateTo: () => void 0,
  setNextIsEnabled: () => void 0,
  setBackIsEnabled: () => void 0,
  registerStepValidator: () => () => void 0,
  checkStepIsValid: () => true,
});

export const WizardEnabledContext = createContext<WizardEnabledContextProps>({
  isNextEnabled: true,
  isBackEnabled: true,
});

export const WizardRegistrationContext = createContext<WizardRegistrationContextProps>({
  isValid: false,
  upsertStep: () => void 0,
  removeStep: () => void 0,
});

export const WizardStepIdContext = createContext<WizardStepIdContextProps>({ id: '' });

/** Tells <Wizard> whether to render as a dialog (default) or inline in the page flow. */
export const WizardRenderModeContext = createContext<WizardRenderModeContextProps>({ mode: 'dialog' });
