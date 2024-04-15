import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../../components/Component';
import { ValidationContext, ValidationContextProps } from './ValidationContext';
import { ValidationRecord } from './ValidationModels';
import { Collection, Records } from '@anupheaus/common';
import { UseCallbacks } from '../../hooks';

export interface ValidateSectionProps {
  name: string;
  children: ReactNode;
}

interface Props extends ValidateSectionProps {
  errors: Records<ValidationRecord>;
  invalidSections: Collection<string>;
  highlightErrorsCallbacks: UseCallbacks<(shouldHighlight: boolean) => void>;
}

export const ValidateSection = createComponent('ValidateSection', ({
  name,
  errors: hookErrors,
  invalidSections,
  highlightErrorsCallbacks,
  children,
}: Props) => {
  const errors = useRef(new Records<ValidationRecord>()).current;

  useLayoutEffect(() => {
    if (errors.length > 0) {
      hookErrors.upsert(errors.toArray());
      invalidSections.add(name);
    }
    // listen on errors
    return errors.onModified((records, reason) => {
      switch (reason) {
        case 'add': hookErrors.upsert(records); break;
        case 'remove': hookErrors.remove(records); break;
        case 'clear': hookErrors.clear(); break;
      }
      if (errors.length > 0) {
        invalidSections.add(name);
      } else {
        invalidSections.remove(name);
      }
    });
  }, []);

  useEffect(() => () => {
    hookErrors.remove(errors.ids());
    invalidSections.remove(name);
  }, []);

  const context = useMemo<ValidationContextProps>(() => ({
    isReal: true,
    name,
    errors,
    invalidSections,
    highlightErrorsCallbacks,
  }), [name]);

  return (
    <ValidationContext.Provider value={context}>
      {children}
    </ValidationContext.Provider>
  );
});