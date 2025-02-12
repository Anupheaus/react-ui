// import { AnyObject, Event, is } from '@anupheaus/common';
// import { useContext, useLayoutEffect } from 'react';
// import { useBound, useForceUpdate } from '../../hooks';
// import { FormContext } from './FormContext';

// export function useFormState<T = AnyObject>() {
//   const { isReal, original: originalProxy, current: currentProxy, errors, showAllErrors: showAllErrorsEvent, save } = useContext(FormContext);
//   const update = useForceUpdate();

//   if (!isReal) throw new Error('useFormStatus must be used within a Form');

//   const current = currentProxy.get(currentProxy.proxy);
//   const original = originalProxy.get(originalProxy.proxy);

//   const isDirty = !is.deepEqual(original, current);
//   const isValid = errors.length === 0;

//   const showAllErrors = useBound(() => Event.raise(showAllErrorsEvent));

//   useLayoutEffect(() => currentProxy.onSet(currentProxy.proxy, () => update(), { includeSubProperties: true }), [currentProxy.proxy]);
//   useLayoutEffect(() => originalProxy.onSet(originalProxy.proxy, () => update(), { includeSubProperties: true }), [originalProxy.proxy]);
//   useLayoutEffect(() => errors.onModified(() => update()), []);
//   useLayoutEffect(() => {
//     if ((errors.length === 0 && isValid === true) || (errors.length > 0 && isValid === false)) return;
//     update();
//   }, [isValid]);

//   return {
//     isDirty,
//     isValid,
//     current: current as T,
//     original: original as T,
//     save,
//     showAllErrors,
//   };
// }
