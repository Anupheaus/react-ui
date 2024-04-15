import { ReactNode, useMemo, useRef, useState } from 'react';
import { createComponent } from '../../components/Component';
import { Collection, PromiseMaybe, Records, is } from '@anupheaus/common';
import { ValidationRecord, ValidationTools } from './ValidationModels';
import { ValidateSection as ValidateSectionComponent, ValidateSectionProps } from './ValidateSection';
import { useBound, useCallbacks, useForceUpdate, useId } from '../../hooks';
import { subscribeToParentValidation } from './subscribeToParentValidation';

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
  subscribeToParentValidation(errors, invalidSections, highlightErrorsCallbacks);

  const highlightValidationErrors = useBound(() => {
    if (errorsAreHighlightedRef.current === true) return;
    errorsAreHighlightedRef.current = true;
    highlightErrorsCallbacks.invoke(true);
  });

  const ValidateSection = useMemo(() => createComponent('ValidateSection', (props: ValidateSectionProps) => (
    <ValidateSectionComponent {...props} errors={errors} invalidSections={invalidSections} highlightErrorsCallbacks={highlightErrorsCallbacks} />
  )), []);

  const getInvalidSections = useBound(() => invalidSections.get());

  const validate = (...delegates: ((tools: ValidationTools) => PromiseMaybe<ReactNode | void>)[]) => {
    const validateId = useId();
    const [highlight, setHighlight] = useState(false);
    const update = useForceUpdate();
    highlightErrorsCallbacks.register(setHighlight);

    const setError = (error: void | ReactNode | undefined) => {
      if (error != null) {
        errors.upsert({ id: validateId, message: error, validationId: id });
      } else {
        errors.remove(validateId);
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
    ValidateSection,
    getInvalidSections,
    highlightValidationErrors,
    /* Using isValid will enable the error highlighting */
    isValid,
    validate,
    getErrors,
  };
}