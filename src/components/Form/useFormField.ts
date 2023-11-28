import { is } from '@anupheaus/common';
import { ReactNode, useContext, useLayoutEffect, useState } from 'react';
import { useBound, useForceUpdate } from '../../hooks';
import { FormContext } from './FormContext';
import { useFormValidation } from './useFormValidation';

interface Props<T> {
  isRequired?: boolean;
  requiredMessage?: ReactNode;
  defaultValue?: T | (() => T);
}

export function useFormField<T>(field: T, { isRequired = false, requiredMessage, defaultValue }: Props<T> = {}) {
  const { original, current, showAllErrors } = useContext(FormContext);
  const update = useForceUpdate();
  const [isErrorVisible, setErrorVisible] = useState(false);

  if (!original.isSet(field) && defaultValue !== undefined) {
    const newValue = is.function(defaultValue) ? defaultValue() : defaultValue;
    original.set(field, newValue);
    current.set(field, newValue);
  }
  const value = current.get(field);
  const isDirty = !is.deepEqual(original.get(field), value);

  const error = useFormValidation(({ validateRequired }) => validateRequired(value, isRequired, requiredMessage));

  const set = useBound((newValue: T, updateOriginal = false) => {
    if (!isErrorVisible) setErrorVisible(true);
    current.set(field, newValue);
    if (updateOriginal) original.set(field, newValue);
  });

  const onBlur = useBound(() => setErrorVisible(true));

  useLayoutEffect(() => current.onSet(field, () => update()), [field]);
  useLayoutEffect(() => original.onSet(field, () => update()), [field]);
  useLayoutEffect(() => showAllErrors(() => setErrorVisible(true)), []);

  return {
    error: isErrorVisible ? error : undefined,
    value,
    isDirty,
    set,
    onBlur,
  };
}