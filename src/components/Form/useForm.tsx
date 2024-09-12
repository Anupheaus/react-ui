import { AnyObject, is } from '@anupheaus/common';
import { useMemo } from 'react';
import { ReactUIComponent, createComponent } from '../Component';
import { useDistributedState } from '../../hooks';
import { InternalFormState } from './InternalFormModels';
import { FormField as FormFieldComponent, FieldComponent, FormFieldProps } from './FormField';
import { createUseFormField } from './useFormField';

export function useForm<T extends AnyObject>(data?: T, onChange?: (data: T) => void) {
  const { state, get, onChange: onStateDataChanged } = useDistributedState<InternalFormState<T>>(() => ({ data: (data ?? {}) as T, originalData: (data ?? {}) as T }), [data]);

  onStateDataChanged(newData => onChange?.(newData.data as T));

  const useFormField = createUseFormField<T>(state);

  const FormField = useMemo<ReactUIComponent<<F extends FieldComponent>(props: FormFieldProps<F, T>) => JSX.Element>>(() => 
    createComponent('FormField', <F extends FieldComponent>(props: FormFieldProps<F, T>) => (
      <FormFieldComponent<F, T> {...props} state={state} useFormField={useFormField as any} />
    )), [state]);

  const getCurrent = () => get().data;
  
  const isDirty = ()=>{
    const { data: currentData, originalData } = get();
    return !is.deepEqual(currentData, originalData);
  };

  return {
    FormField,
    getCurrent,
    isDirty,
    useFormField,
  };
}