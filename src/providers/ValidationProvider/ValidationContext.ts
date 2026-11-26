import { Collection, Records } from '@anupheaus/common';
import { createContext } from 'react';
import type { ValidationRecord } from './ValidationModels';
import type { UseCallbacks } from '../../hooks';

export interface ValidationContextProps {
  isReal: boolean;
  id: string;
  errors: Records<ValidationRecord>;
  invalidSections: Collection<string>;
  highlightErrorsCallbacks: UseCallbacks<(shouldHighlight: boolean) => void>;
}

export const ValidationContext = createContext<ValidationContextProps>({
  isReal: false,
  id: '',
  errors: new Records(),
  invalidSections: new Collection(),
  // The default (isReal: false) context is never asked for callbacks; consumers check isReal first.
  highlightErrorsCallbacks: null as unknown as UseCallbacks<(shouldHighlight: boolean) => void>,
});
