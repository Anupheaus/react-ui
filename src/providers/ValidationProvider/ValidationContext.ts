import { Collection, Records } from '@anupheaus/common';
import { createContext } from 'react';
import { ValidationRecord } from './ValidationModels';
import { UseCallbacks } from '../../hooks';

export interface ValidationContextProps {
  isReal: boolean;
  errors: Records<ValidationRecord>;
  invalidSections: Collection<string>;
  highlightErrorsCallbacks: UseCallbacks<(shouldHighlight: boolean) => void>;
}

export const ValidationContext = createContext<ValidationContextProps>({
  isReal: false,
  errors: new Records(),
  invalidSections: new Collection(),
  highlightErrorsCallbacks: null as any,
});
