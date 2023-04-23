import { createProxyOf, EventDelegate, PromiseMaybe, Records } from '@anupheaus/common';
import { createContext, MutableRefObject } from 'react';
import { FormError } from './FormModels';

type Proxy = ReturnType<typeof createProxyOf>;

export interface FormContextProps {
  isReal: boolean;
  original: Proxy;
  current: Proxy;
  errors: Records<FormError>;
  showAllErrors: EventDelegate<() => void>;
  onBeforeSave: EventDelegate<(data: unknown) => PromiseMaybe<unknown>>;
  onSave: MutableRefObject<((data: unknown) => PromiseMaybe<unknown>) | undefined>;
  save(): Promise<void>;
}

export const FormContext = createContext<FormContextProps>({
  isReal: false,
  original: {} as unknown as Proxy,
  current: null as unknown as Proxy,
  errors: null as unknown as Records<FormError>,
  showAllErrors: null as unknown as EventDelegate<() => void>,
  onBeforeSave: null as unknown as EventDelegate<(data: unknown) => PromiseMaybe<unknown>>,
  onSave: null as unknown as MutableRefObject<((data: unknown) => PromiseMaybe<void>) | undefined>,
  save: () => Promise.resolve(),
});