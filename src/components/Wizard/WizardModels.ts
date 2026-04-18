// src/components/Wizard/WizardModels.ts
import type { ComponentType, MutableRefObject, ReactNode } from 'react';
import type { DistributedState } from '../../hooks';
import type { WindowAction, WindowOkAction } from '../Windows/Window';

export interface StepRecord {
  id: string;
  children: ReactNode;
}

export interface WizardNavigationUtils {
  moveNext(): void;
  moveBack(): void;
  setNextIsEnabled(enabled: boolean): void;
  setBackIsEnabled(enabled: boolean): void;
}

export interface WizardContextProps extends WizardNavigationUtils {
  state: DistributedState<string>;
  steps: StepRecord[];
  isNextEnabled: boolean;
  isBackEnabled: boolean;
}

export interface WizardRegistrationContextProps {
  isValid: boolean;
  upsertStep(record: StepRecord): void;
  removeStep(id: string): void;
}

export interface WizardStepIdContextProps {
  id: string;
}

export interface WizardStepDefinitionUtils extends WizardNavigationUtils {
  id: string;
}

export interface WizardStepProps {
  id?: string;
  children: ReactNode;
}

export interface WizardProps {
  className?: string;
  title?: ReactNode;
  icon?: ReactNode;
  step?: string;
  onStepChange?(id: string): void;
  hideCloseButton?: boolean;
  hideMaximizeButton?: boolean;
  disableDrag?: boolean;
  disableResize?: boolean;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  isLoading?: boolean;
  children?: ReactNode;
  onClosing?(reason?: string): void | boolean | Promise<void | boolean>;
  onClosed?(reason?: string): void;
  onFocus?(isFocused: boolean): void;
  navigationRef?: MutableRefObject<WizardNavigationUtils | null>;
}

export interface WizardDefinitionUtils<CloseResponseType = string | undefined> extends WizardNavigationUtils {
  Wizard: ComponentType<WizardProps>;
  Step: ComponentType<WizardStepProps>;
  Actions: ComponentType<{ children?: ReactNode }>;
  Action: typeof WindowAction;
  OkButton: typeof WindowOkAction;
  id: string;
  close(response?: CloseResponseType): Promise<void>;
}

export type WizardDefinition<Args extends unknown[] = any, CloseResponseType = string | undefined> =
  (utils: WizardDefinitionUtils<CloseResponseType>) => (...args: Args) => JSX.Element | null;
