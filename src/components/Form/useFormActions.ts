import { useContext } from 'react';
import { FormContext } from './FormContext';

export function useFormActions() {
  const { isReal, save, cancel } = useContext(FormContext);

  return {
    isInForm: isReal,
    save,
    cancel,
  };
}