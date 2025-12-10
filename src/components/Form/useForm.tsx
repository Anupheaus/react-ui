// import { AnyObject, is } from '@anupheaus/common';
// import { useMemo } from 'react';
// import { ReactUIComponent, createComponent } from '../Component';
// import { useDistributedState } from '../../hooks';
// import { InternalFormState } from './InternalFormModels';
// import { FormField as FormFieldComponent, FieldComponent, FormFieldProps } from './FormField';
// import { createUseFormField } from './useFormField';

import { is, type AnyObject, type PromiseMaybe } from '@anupheaus/common';
import { createComponent } from '../Component';
import { useBound, useId, useUpdatableState } from '../../hooks';
import { useFields } from '../Field';
import type { ReactNode } from 'react';
import { useContext, useMemo, useRef } from 'react';
import type { FormContextProps } from './FormContext';
import { FormContext } from './FormContext';
import { useNotifications } from '../Notifications';
import { FormObserverContext } from './Observer/FormObserverContext';

// export function useForm<T extends AnyObject>(data?: T, onChange?: (data: T) => void) {
//   const { state, get, onChange: onStateDataChanged } = useDistributedState<InternalFormState<T>>(() => ({ data: (data ?? {}) as T, originalData: (data ?? {}) as T }), [data]);

//   onStateDataChanged(newData => onChange?.(newData.data as T));

//   const useFormField = createUseFormField<T>(state);

//   const FormField = useMemo<ReactUIComponent<<F extends FieldComponent>(props: FormFieldProps<F, T>) => JSX.Element>>(() => 
//     createComponent('FormField', <F extends FieldComponent>(props: FormFieldProps<F, T>) => (
//       <FormFieldComponent<F, T> {...props} state={state} useFormField={useFormField as any} />
//     )), [state]);

//   const getCurrent = () => get().data;

//   const isDirty = ()=>{
//     const { data: currentData, originalData } = get();
//     return !is.deepEqual(currentData, originalData);
//   };

//   return {
//     FormField,
//     getCurrent,
//     isDirty,
//     useFormField,
//   };
// }

interface FormProps {
  children: ReactNode;
}

interface Props<T extends AnyObject> {
  data?: T;
  hideNotifications?: boolean;
  onChange?(data: T): PromiseMaybe<void>;
  onSave?(data: T): PromiseMaybe<void>;
}

export function useForm<T extends AnyObject>({
  data: providedData,
  hideNotifications = false,
  onChange,
  onSave,
}: Props<T>) {
  const id = useId();
  const { setIsDirty: setIsDirtyContext } = useContext(FormObserverContext);
  const [data, setData] = useUpdatableState<T | undefined>(() => providedData, [providedData]);
  const setIsDirty = useBound((isDirty: boolean) => {
    isDirtyRef.current = isDirty;
    setIsDirtyContext(id, isDirty);
  });
  const isDirtyRef = useRef(false);
  const wrapSetData = useBound(async (updatedData: T) => {
    if (is.deepEqual(updatedData, data)) return;
    setIsDirty(true);
    if (is.function(onChange)) { await onChange(updatedData); } else { setData(updatedData); }
  });
  const { Field, useField } = useFields(data, wrapSetData);
  const { showSuccess } = useNotifications();

  const save = useBound(async () => {
    if (!isDirtyRef.current || data == null) return;
    await onSave?.(data);
    setIsDirty(false);
    if (!hideNotifications) showSuccess('Changes have been saved.');
  });
  const cancel = useBound(() => {
    if (!isDirtyRef.current) return;
    setIsDirty(false);
    setData(providedData);
    if (!hideNotifications) showSuccess('Changes have been discarded.');
  });
  const getIsDirty = useBound(() => isDirtyRef.current);

  const Form = useMemo(() => createComponent('Form', ({
    children,
  }: FormProps) => {
    const context = useMemo<FormContextProps>(() => ({
      isReal: true,
      save,
      cancel,
      getIsDirty,
    }), []);

    return (
      <FormContext.Provider value={context}>
        {children}
      </FormContext.Provider>
    );
  }), []);

  return {
    Field,
    useField,
    Form,
  };
}
