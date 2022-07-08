import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { Context } from './context';
import { OnErrorProps } from './models';

export function useErrors() {
  const { captureError, resetError, getError, registerOnError } = useContext(Context);
  const errorIsRequestedRef = useRef(false);
  const callbacks = useRef(new Set<(props: OnErrorProps) => void>()).current;
  const forceUpdate = useReducer(s => 1 - s, 0)[1];

  const isUnmountedRef = useRef(false);
  useEffect(() => () => { isUnmountedRef.current = true; }, []);

  const tryCatch = <T>(delegate: () => T, isAsync = false) => {
    try {
      const result = delegate();
      if (result instanceof Promise) {
        return result.catch(err => captureError(err, true));
      } else {
        return result;
      }
    } catch (err) {
      captureError(err as Error, isAsync);
      return undefined as unknown as T;
    }
  };

  useEffect(() => registerOnError((props?: OnErrorProps) => {
    if (isUnmountedRef.current) return;
    if (props != null) callbacks.forEach(callback => callback(props));
    if (props?.occurredWithinThisBoundary && errorIsRequestedRef.current) forceUpdate(); // refresh this component if the error has been requested
  }), []);

  const onError = useCallback((handler: (props: OnErrorProps) => void) => callbacks.add(handler), []);

  return {
    get error() { errorIsRequestedRef.current = true; return getError(); },
    onError,
    resetError,
    tryCatch,
  };
}