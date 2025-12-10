// import { createProxyOf, EventDelegate, PromiseMaybe, Records } from '@anupheaus/common';
// import { createContext, MutableRefObject } from 'react';
// import { FormError } from './FormModels';

import type { PromiseMaybe } from '@anupheaus/common';
import { createContext } from 'react';

// type Proxy = ReturnType<typeof createProxyOf>;

// export interface FormContextProps {
//   isReal: boolean;
//   original: Proxy;
//   current: Proxy;
//   errors: Records<FormError>;
//   showAllErrors: EventDelegate<() => void>;
//   onBeforeSave: EventDelegate<(data: unknown) => PromiseMaybe<unknown>>;
//   onSave: MutableRefObject<((data: unknown) => PromiseMaybe<unknown>) | undefined>;
//   save(): Promise<void>;
// }

// export const FormContext = createContext<FormContextProps>({
//   isReal: false,
//   original: {} as unknown as Proxy,
//   current: null as unknown as Proxy,
//   errors: new Records(),
//   showAllErrors: null as unknown as EventDelegate<() => void>,
//   onBeforeSave: null as unknown as EventDelegate<(data: unknown) => PromiseMaybe<unknown>>,
//   onSave: null as unknown as MutableRefObject<((data: unknown) => PromiseMaybe<void>) | undefined>,
//   save: () => Promise.resolve(),
// });

export interface FormContextProps {
  isReal: boolean;
  save(): PromiseMaybe<void>;
  cancel(): PromiseMaybe<void>;
}

export const FormContext = createContext<FormContextProps>({
  isReal: false,
  save: () => Promise.resolve(),
  cancel: () => Promise.resolve(),
});