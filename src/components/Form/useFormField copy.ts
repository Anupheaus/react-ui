// import { AnyFunction, ProxyOf, createProxyOf, is, to } from '@anupheaus/common';
// import { ReactNode, useRef } from 'react';
// import { useForceUpdate } from '../../hooks';

// interface Props<T> {
//   isRequired?: boolean;
//   requiredMessage?: ReactNode;
//   refreshOnSubPropertyChange?: boolean;
//   defaultValue?: T | (() => T);
// }

// function internalUseFormFieldA<T>(field: ProxyOf<T>, { /*isRequired = false, requiredMessage,*/ refreshOnSubPropertyChange = false, /*defaultValue*/ }: Props<T> = {}) {
//   const update = useForceUpdate();
//   // const { validate } = useValidation();
//   const api = to.proxyApi(field);
//   if (api == null) throw new Error('The field must be a proxy');
//   const { value, set, onSet } = api;
//   const nonceRef = useRef<string>();

//   onSet(() => {
//     if (refreshOnSubPropertyChange) nonceRef.current = Math.uniqueId();
//     update();
//   }, { includeSubProperties: refreshOnSubPropertyChange });

//   // const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(value, isRequired, requiredMessage));

//   // const onBlur = useBound(() => enableErrors());

//   return {
//     // error,
//     nonce: nonceRef.current,
//     value,
//     set,
//     // onBlur,
//   };
// }

// class UseFormFieldReturnType<T> {
//   public resultA() { return internalUseFormFieldA<T>(null as T, {}); }
//   public resultB() { return internalUseFormFieldB<T>(null as T, () => void 0); }
// }

// export type UseFormFieldResultA<T> = ReturnType<UseFormFieldReturnType<T>['resultA']>;

// const newObject = {};

// function internalUseFormFieldB<T>(field: T, onChange: (value: T) => void): ProxyOf<NonNullable<T>> {
//   if (is.proxy(field)) return field as ProxyOf<NonNullable<T>>;
//   const { proxy, get, onAfterSet } = createProxyOf(Object.clone(field ?? newObject));
//   onAfterSet(proxy, () => onChange(Object.clone(get(proxy)) as T), { includeSubProperties: true });
//   return proxy as ProxyOf<NonNullable<T>>;
// }

// export type UseFormFieldResultB<T> = ReturnType<UseFormFieldReturnType<T>['resultB']>;

// export function useFormField<T>(value: T | undefined, onChange?: (value: T) => void, props?: Props<T>): UseFormFieldResultB<T>;
// export function useFormField<T>(field: T, props?: Props<T>): UseFormFieldResultA<T>;
// export function useFormField<T>(...args: unknown[]): UseFormFieldResultA<T> | UseFormFieldResultB<T> {
//   const fieldOrValue = args[0] as T;
//   const onChange = ((args.length > 1 && is.function(args[1])) ? args[1] : undefined) as AnyFunction | undefined;
//   const props = (args.length > 1 && is.plainObject(args[1]) ? args[1] : (args.length > 2 && is.plainObject(args[2])) ? args[1] : undefined) as Props<T> | undefined;
//   if (onChange != null) return internalUseFormFieldB(fieldOrValue, onChange);
//   return internalUseFormFieldA(fieldOrValue, props);
// }