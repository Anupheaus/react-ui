import { AnyObject, createProxyOf, Event, Records } from '@anupheaus/common';
import { useMemo, useRef } from 'react';
import { useBound, useOnChange } from '../../hooks';
import { createComponent } from '../Component';
import { FormProps, Form as FormComponent } from './Form';
import { FormContext, FormContextProps } from './FormContext';
import { FormSaveButton } from './FormSaveButton';
import { FormToolbar } from './FormToolbar';

interface Props<T extends AnyObject> {
  data: T;
}

export function useForm<T extends AnyObject>({ data: providedData }: Props<T>) {
  const [original, current] = useMemo(() => [createProxyOf(Object.clone(providedData)), createProxyOf(Object.clone(providedData))], []);
  const onSave = useRef<FormContextProps['onSave']['current']>();

  const setOriginalAndCurrentTo = (newData: T) => {
    current.set(current.proxy, Object.clone(newData));
    original.set(original.proxy, Object.clone(newData));
  };

  useOnChange(() => {
    setOriginalAndCurrentTo(providedData);
  }, [providedData]);

  const save = useBound(async () => {
    Event.raise(context.showAllErrors);
    if (context.errors.length > 0) return;
    let dataToSave = current.get(current.proxy) as unknown;
    if (Event.getSubscriptionCountFor(context.onBeforeSave) > 0) {
      dataToSave = await Event.raise(context.onBeforeSave, dataToSave);
      if (dataToSave == null) return;
    }
    const newData = onSave.current ? await onSave.current(dataToSave) : dataToSave;
    if (newData == null) return;
    setOriginalAndCurrentTo(newData as T);
  });

  const context = useMemo<FormContextProps>(() => ({
    isReal: true,
    original,
    current,
    errors: new Records(),
    showAllErrors: Event.create({ raisePreviousEventsOnNewSubscribers: true }),
    onBeforeSave: Event.create({ mode: 'passthrough', }),
    onSave,
    save,
  }), [original, current]);

  const Form = useMemo(() => createComponent('Form', (props: FormProps<T>) => (
    <FormContext.Provider value={context}>
      <FormComponent {...props} />
    </FormContext.Provider>
  )), []);

  return {
    data: current.proxy,
    get: current.get,
    Form,
    SaveButton: FormSaveButton,
    Toolbar: FormToolbar,
  };
}