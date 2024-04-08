import { AnyObject, createProxyOf, Event, ProxyOf, Records } from '@anupheaus/common';
import { useMemo, useRef } from 'react';
import { useBound, useForceUpdate, useOnChange } from '../../hooks';
import { createComponent, ReactUIComponent } from '../Component';
import { FormProps, Form as FormComponent } from './Form';
import { FormContext, FormContextProps } from './FormContext';
import { FormSaveButton } from './FormSaveButton';
import { FormToolbar } from './FormToolbar';

interface Props<T extends AnyObject> {
  data: T;
}

export interface UseForm<T extends AnyObject> {
  data: ProxyOf<T>;
  get<V>(field: V): any;
  useFormField<V>(field: V): any;
  Form: ReactUIComponent<(props: FormProps<T>) => JSX.Element>;
  SaveButton: typeof FormSaveButton;
  Toolbar: typeof FormToolbar;

}

export function useForm<T extends AnyObject>({ data: providedData }: Props<T>): UseForm<T> {
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

  const useFormField = function <V>(field: V) {
    const update = useForceUpdate();
    current.onSet(current.proxy, () => update(), { includeSubProperties: true });
    return current.get(field);
  };

  const context = useMemo<FormContextProps>(() => ({
    isReal: true,
    original: original as any,
    current: current as any,
    errors: new Records(),
    showAllErrors: Event.create({ raisePreviousEventsOnNewSubscribers: true }),
    onBeforeSave: Event.create({ mode: 'passthrough', }),
    onSave,
    save,
  }), [original, current]);

  const Form: ReactUIComponent<(props: FormProps<T>) => JSX.Element> = useMemo(() => createComponent('Form', (props: FormProps<T>) => (
    <FormContext.Provider value={context}>
      <FormComponent {...props} />
    </FormContext.Provider>
  )), []);

  return {
    data: current.proxy,
    get: current.get,
    useFormField,
    Form,
    SaveButton: FormSaveButton,
    Toolbar: FormToolbar,
  };
}
