import { ComponentProps, ReactNode, useContext, useMemo, useRef, useState } from 'react';
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

export function useValidation() {
  const errors = useRef(new Records<ValidationRecord>()).current;
  const invalidSections = useRef(new Collection<string>()).current;
  const highlightErrorsCallbacks = useCallbacks<(shouldHighlight: boolean) => void>();

  const ValidateSection = useMemo(() => createComponent('ValidationSection', (props: ComponentProps<typeof ValidateSectionComponent>) => {
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
  }), []);

  const getInvalidSections = useBound(() => invalidSections.get());

  const highlightValidationErrors = useBound(() => {
    highlightErrorsCallbacks.invoke(true);
  });

  const validate = (...delegates: ((tools: ValidationTools) => PromiseMaybe<ReactNode | void>)[]) => {
    const id = useId();
    const [highlight, setHighlight] = useState(false);
    const { isReal, errors: validationErrors, highlightErrorsCallbacks: localHighlightErrorsCallbacks } = useContext(ValidationContext);
    const update = useForceUpdate();
    if (isReal) localHighlightErrorsCallbacks.register(setHighlight);

    const setError = (error: void | ReactNode | undefined) => {
      if (error != null) {
        validationErrors.upsert({ id, message: error });
      } else {
        validationErrors.remove(id);
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
      error: highlight === true ? ((error === true ? (errors.get(id)?.message ?? 'Validation result pending...') : error) ?? null) : null,
      enableErrors,
    };
  };

  const isValid = useBound(() => {
    highlightValidationErrors();
    return errors.isEmpty;
  });

  return {
    ValidateSection,
    getInvalidSections,
    highlightValidationErrors,
    isValid,
    validate,
  };
}