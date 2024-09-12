import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../../components/Component';
import { ValidationContext, ValidationContextProps } from './ValidationContext';
import { ValidationRecord } from './ValidationModels';
import { Collection, Records } from '@anupheaus/common';
import { UseCallbacks, useId } from '../../hooks';

export interface ValidateSectionProps {
  id?: string;
  children: ReactNode;
}

interface Props extends ValidateSectionProps {
  errors: Records<ValidationRecord>;
  invalidSections: Collection<string>;
  highlightErrorsCallbacks: UseCallbacks<(shouldHighlight: boolean) => void>;
}

export const ValidateSection = createComponent('ValidateSection', ({
  id: providedId,
  errors: hookErrors,
  invalidSections,
  highlightErrorsCallbacks,
  children,
}: Props) => {
  const id = providedId ?? useId();
  const errors = useRef(new Records<ValidationRecord>()).current;

  useLayoutEffect(() => {
    if (errors.length > 0) {
      hookErrors.upsert(errors.toArray());
      invalidSections.add(id);
    }
    // listen on errors
    return errors.onModified((records, reason) => {
      switch (reason) {
        case 'add': hookErrors.upsert(records); break;
        case 'remove': hookErrors.remove(records); break;
        case 'clear': hookErrors.clear(); break;
      }
      if (errors.length > 0) {
        invalidSections.add(id);
      } else {
        invalidSections.remove(id);
      }
    });
  }, []);

  useEffect(() => () => {
    hookErrors.remove(errors.ids());
    invalidSections.remove(id);
  }, []);

  const context = useMemo<ValidationContextProps>(() => ({
    isReal: true,
    id,
    errors,
    invalidSections,
    highlightErrorsCallbacks,
  }), [id]);

  return (
    <ValidationContext.Provider value={context}>
      {children}
    </ValidationContext.Provider>
  );
});