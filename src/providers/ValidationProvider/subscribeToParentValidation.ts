import { Collection, Records } from '@anupheaus/common';
import { UseCallbacks } from '../../hooks';
import { ValidationRecord } from './ValidationModels';
import { useContext, useLayoutEffect, useRef } from 'react';
import { ValidationContext } from './ValidationContext';

export function subscribeToParentValidation(errors: Records<ValidationRecord>, invalidSections: Collection<string>,
  highlightErrorsCallbacks: UseCallbacks<(shouldHighlight: boolean) => void>) {
  const parentContext = useContext(ValidationContext);
  if (!parentContext.isReal) return;
  const errorsAreHighlightedRef = useRef(false);

  // register from the parent any highlight error callbacks
  if (parentContext.isReal) {
    parentContext.highlightErrorsCallbacks.register(shouldHighlight => {
      if (errorsAreHighlightedRef.current === true) return;
      if (shouldHighlight) errorsAreHighlightedRef.current = true;
      highlightErrorsCallbacks.invoke(shouldHighlight);
    });
  }

  useLayoutEffect(() => {
    if (!parentContext.isReal) return;
    parentContext.errors.upsert(errors.toArray());
    parentContext.invalidSections.add(invalidSections.get());

    // save our subscriptions
    const unsubscribers = [
      // when our errors change, update the parent context
      errors.onModified((records, reason) => {
        switch (reason) {
          case 'add': parentContext.errors.upsert(records); break;
          case 'remove': parentContext.errors.remove(records); break;
          case 'clear': parentContext.errors.clear(); break;
        }
      }),
      // when our invalid sections change, update the parent context
      invalidSections.onModified((sections, reason) => {
        switch (reason) {
          case 'add': parentContext.invalidSections.add(sections); break;
          case 'remove': parentContext.invalidSections.remove(sections); break;
          case 'clear': parentContext.invalidSections.clear(); break;
        }
      }),
    ];

    return () => {
      // unsubscribe from our subscriptions
      unsubscribers.forEach(unsub => unsub());
      // remove any errors and invalid sections that we have provided to the parent context
      parentContext.errors.remove(errors.ids());
      parentContext.invalidSections.remove(invalidSections.toArray());
    };
  }, [parentContext]);

}