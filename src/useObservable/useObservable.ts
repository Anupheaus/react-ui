// import { useEffect, useLayoutEffect, useRef } from 'react';
// import { useBatchUpdates } from '../hooks/useBatchUpdates';
// import { useBound } from '../hooks/useBound';
// import { useForceUpdate } from '../hooks/useForceUpdate';

// export interface ReadOnlyObservable<T> {
//   readonly current: T;
//   get(): T;
//   subscribe(callback: (value: T) => void): void;
// }

// export interface Observable<T> extends ReadOnlyObservable<T> {
//   setValue(value: T): void;
// }

// export function useObservable<T>(value: T) {
//   const lastValueRef = useRef(value);
//   const doNotUpdateRef = useRef(false);
//   const valueRef = useRef(value);
//   const callbacks = useRef(new Set<(value: T) => void>()).current;
//   const batchUpdates = useBatchUpdates();
//   const invokeCallbacks = () => callbacks.forEach(callback => callback(valueRef.current));

//   const setValue = useBound((updatedValue: T) => {
//     if (Reflect.areDeepEqual(updatedValue, valueRef.current)) return;
//     batchUpdates(() => {
//       valueRef.current = updatedValue;
//       invokeCallbacks();
//     });
//   });

//   const subscribe = (callback: (value: T) => void) => {
//     callbacks.add(callback);
//     useLayoutEffect(() => { batchUpdates(() => callback(valueRef.current)); }, []);
//     useEffect(() => () => { callbacks.delete(callback); }, []);
//   };

//   if (!Reflect.areDeepEqual(value, lastValueRef.current)) {
//     lastValueRef.current = value;
//     doNotUpdateRef.current = true; // prevent callbacks from calling another refresh
//     setValue(value);
//     doNotUpdateRef.current = false; // switch it off again in case it was not called
//   }

//   return {
//     get current() {
//       const update = useForceUpdate();
//       subscribe(() => {
//         if (doNotUpdateRef.current) { doNotUpdateRef.current = false; return; }
//         update();
//       });
//       return valueRef.current;
//     },
//     get() { return valueRef.current; },
//     setValue,
//     subscribe,
//   };
// }
