import { ComponentProps, ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../../components/Component';
import { Collection, PromiseMaybe, Records, is } from '@anupheaus/common';
import { ValidationRecord, ValidationTools } from './ValidationModels';
import { ValidationContext, ValidationContextProps } from './ValidationContext';
import { ValidateSection as ValidateSectionComponent } from './ValidateSection';
import { useBound, useCallbacks, useForceUpdate, useId } from '../../hooks';

function createTools(): ValidationTools {
  return {
    validateRequired: (value: unknown, isRequired: boolean, requiredMessage: ReactNode = 'This field is required') => {
      if (!isRequired) return undefined;
      if (value == null) return requiredMessage;
      if (typeof (value) === 'string' && value.trim() === '') return requiredMessage;
      if (typeof (value) === 'number' && isNaN(value)) return requiredMessage;
    },
  };
}

export function useValidation(id?: string) {
  const errors = useRef(new Records<ValidationRecord>()).current;
  const invalidSections = useRef(new Collection<string>()).current;
  const highlightErrorsCallbacks = useCallbacks<(shouldHighlight: boolean) => void>();
  const errorsAreHighlightedRef = useRef(false);

  const highlightValidationErrors = useBound(() => {
    highlightErrorsCallbacks.invoke(true);
  });

  const createValidateSection = () => {
    return createComponent('ValidationSection', (props: ComponentProps<typeof ValidateSectionComponent>) => {
      const parentContext = useContext(ValidationContext);

      if (parentContext.isReal) {
        parentContext.highlightErrorsCallbacks.register(shouldHighlight => {
          if (!shouldHighlight || errorsAreHighlightedRef.current === true) return;
          errorsAreHighlightedRef.current = true;
          highlightValidationErrors();
        });
      }

      useLayoutEffect(() => {
        if (!parentContext.isReal) return;
        errors.toArray().forEach(err => parentContext.errors.upsert(err));
        invalidSections.toArray().forEach(sect => parentContext.invalidSections.add(sect));
        const unsubscribes = [
          errors.onAdded(errs => parentContext.errors.upsert(errs)),
          errors.onRemoved(errs => parentContext.errors.remove(errs)),
          errors.onUpdated(errs => parentContext.errors.upsert(errs)),
          errors.onCleared(errs => parentContext.errors.remove(errs)),
          invalidSections.onAdded(sects => parentContext.invalidSections.add(sects)),
          invalidSections.onRemoved(sects => parentContext.invalidSections.remove(sects)),
          invalidSections.onCleared(sects => parentContext.invalidSections.remove(sects)),
        ];
        return () => unsubscribes.forEach(unsub => unsub());
      }, [parentContext]);

      const context = useMemo<ValidationContextProps>(() => ({
        isReal: true,
        errors,
        invalidSections,
        highlightErrorsCallbacks,
      }), []);
      return (
        <ValidationContext.Provider value={context}>
          <ValidateSectionComponent {...props} />
        </ValidationContext.Provider>
      );
    });
  };

  const getInvalidSections = useBound(() => invalidSections.get());

  const validate = (...delegates: ((tools: ValidationTools) => PromiseMaybe<ReactNode | void>)[]) => {
    const validateId = useId();
    const [highlight, setHighlight] = useState(false);
    const { isReal, errors: validationErrors, highlightErrorsCallbacks: localHighlightErrorsCallbacks } = useContext(ValidationContext);
    const update = useForceUpdate();
    if (isReal) localHighlightErrorsCallbacks.register(setHighlight);

    const setError = (error: void | ReactNode | undefined) => {
      if (error != null) {
        validationErrors.upsert({ id: validateId, message: error, validationId: id });
      } else {
        validationErrors.remove(validateId);
      }
    };

    const error = delegates.findMap(delegate => {
      const result = delegate(createTools());
      if (is.promise(result)) {
        const setErrorAndUpdate = (response: void | ReactNode | undefined) => { setError(response); update(); };
        result.then(setErrorAndUpdate, setErrorAndUpdate);
        return true;
      } else {
        setError(result);
        return result;
      }
    }) as void | boolean | ReactNode | undefined;

    const enableErrors = useBound(() => setHighlight(true));

    useEffect(() => () => {
      validationErrors.remove(validateId);
    });

    return {
      error: highlight === true ? ((error === true ? (errors.get(validateId)?.message ?? 'Validation result pending...') : error) ?? null) : null,
      enableErrors,
    };
  };

  const isValid = useBound(() => {
    highlightValidationErrors();
    return errors.isEmpty;
  });

  const getErrors = useBound(() => errors.toArray());

  return {
    get ValidateSection() { return useMemo(() => createValidateSection(), []); },
    getInvalidSections,
    highlightValidationErrors,
    isValid,
    validate,
    getErrors,
  };
}