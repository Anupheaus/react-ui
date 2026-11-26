import type { ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';
import { createComponent } from '../../components/Component';
import type { PromiseMaybe } from '@anupheaus/common';
import { Collection, Records, is } from '@anupheaus/common';
import type { ValidationRecord, ValidationTools } from './ValidationModels';
import type { ValidateSectionProps } from './ValidateSection';
import { ValidateSection as ValidateSectionComponent } from './ValidateSection';
import { useBound, useCallbacks, useForceUpdate, useId } from '../../hooks';
import { useParentValidationSubscription } from './useParentValidationSubscription';
import { useUIState } from '../UIStateProvider';

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

interface UseValidationProps {
  id?: string;
  forceEnable?: boolean;
}

export function useValidation(props?: UseValidationProps | string) {
  const { id, forceEnable = false } = (typeof props === 'string' ? { id: props } : props) ?? {};
  const errors = useRef(new Records<ValidationRecord>()).current;
  const invalidSections = useRef(new Collection<string>()).current;
  const highlightErrorsCallbacks = useCallbacks<(shouldHighlight: boolean) => void>();
  const errorsAreHighlightedRef = useRef(false);
  const { isReadOnly } = useUIState();
  const effectivelyReadOnly = isReadOnly && !forceEnable;

  useParentValidationSubscription(errors, invalidSections, highlightErrorsCallbacks, errorsAreHighlightedRef);

  const highlightValidationErrors = useBound(() => {
    if (errorsAreHighlightedRef.current === true) return;
    errorsAreHighlightedRef.current = true;
    highlightErrorsCallbacks.invoke(true);
  });

  const ValidateSection = useMemo(() => createComponent('ValidateSection', (props: ValidateSectionProps) => (
    <ValidateSectionComponent {...props} errors={errors} invalidSections={invalidSections} highlightErrorsCallbacks={highlightErrorsCallbacks} />
    // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; errors, invalidSections and the callbacks are stable for this hook's lifetime
  )), []);

  const getInvalidSections = useBound(() => invalidSections.get());

  // A hook by contract: callers invoke validate() during render, so it is named as one here and exposed as `validate`.
  const useValidate = (...delegates: ((tools: ValidationTools) => PromiseMaybe<ReactNode | void>)[]) => {
    const validateId = useId();
    const [highlight, setHighlight] = useState(false);
    const update = useForceUpdate();
    highlightErrorsCallbacks.register(setHighlight);

    if (effectivelyReadOnly && errors.has(validateId)) {
      errors.remove(validateId);
    }

    const setError = (error: void | ReactNode | undefined) => {
      if (error != null) {
        errors.upsert({ id: validateId, message: error, validationId: id });
      } else {
        errors.remove(validateId);
      }
    };

    const error = (effectivelyReadOnly ? [] : delegates).findMap(delegate => {
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

    const enableErrors = useBound(() => {
      if (isReadOnly) return;
      setHighlight(true);
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
    ValidateSection,
    getInvalidSections,
    highlightValidationErrors,
    /* Using isValid will enable the error highlighting */
    isValid,
    validate: useValidate,
    getErrors,
  };
}