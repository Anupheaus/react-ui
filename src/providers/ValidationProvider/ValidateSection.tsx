import { ReactNode, useContext, useMemo, useRef } from 'react';
import { createComponent } from '../../components/Component';
import { ValidationContext, ValidationContextProps } from './ValidationContext';
import { ValidationRecord } from './ValidationModels';
import { Collection, Records, Unsubscribe } from '@anupheaus/common';
import { useCallbacks } from '../../hooks';

interface Props {
  name: string;
  children: ReactNode;
}

export const ValidateSection = createComponent('ValidateSection', ({
  name,
  children,
}: Props) => {
  const parentContext = useContext(ValidationContext);
  const errors = new Records<ValidationRecord>();
  const invalidSections = new Collection<string>();
  const errorsUnsubscribeRef = useRef<Unsubscribe>(() => void 0);
  const invalidSectionsUnsubscribeRef = useRef<Unsubscribe>(() => void 0);
  const highlightErrorsCallbacks = useCallbacks<(shouldHighlightErrors: boolean) => void>();

  if (parentContext.isReal) parentContext.highlightErrorsCallbacks.register(highlightErrorsCallbacks.invoke);

  useMemo(() => {
    errorsUnsubscribeRef.current();
    invalidSectionsUnsubscribeRef.current();
    if (!parentContext.isReal) return;

    errorsUnsubscribeRef.current = errors.onModified((records, reason) => {
      switch (reason) {
        case 'add': parentContext.errors.upsert(records); break;
        case 'remove': parentContext.errors.remove(records); break;
        case 'clear': parentContext.errors.clear(); break;
      }
      if (errors.length > 0) {
        invalidSections.add(name);
      } else {
        invalidSections.remove(name);
      }
    });
    parentContext.errors.upsert(errors.toArray());

    invalidSectionsUnsubscribeRef.current = invalidSections.onModified((sections, reason) => {
      switch (reason) {
        case 'add': parentContext.invalidSections.add(sections); break;
        case 'remove': parentContext.invalidSections.remove(sections); break;
        case 'clear': parentContext.invalidSections.clear(); break;
      }
    });
    parentContext.invalidSections.add(invalidSections.get());
  }, [parentContext]);

  const context = useMemo<ValidationContextProps>(() => ({
    isReal: true,
    errors,
    invalidSections,
    highlightErrorsCallbacks,
  }), []);

  return (
    <ValidationContext.Provider value={context}>
      {children}
    </ValidationContext.Provider>
  );
});