/* eslint-disable no-console */
import { Error } from '@anupheaus/common';
import { useContext } from 'react';
import { ErrorContexts } from './ErrorContexts';

interface TryCatchProps<T> {
  isAsync?: boolean;
  onError?(error: Error): T;
}

export function useErrors() {
  const { isValid, recordError } = useContext(ErrorContexts.recordErrors);
  // const errorIsRequestedRef = useRef(false);
  // const callbacks = useRef(new Set<(props: OnErrorProps) => void>()).current;
  // const forceUpdate = useReducer(s => 1 - s, 0)[1];  

  const handleError = <T>(rawError: unknown, { isAsync = false, onError }: TryCatchProps<T>): T => {
    const error = new Error({ error: rawError, isAsync });
    if (onError) return onError(error);
    if (!isValid) console.error(error, { isAsync });
    recordError(error, isAsync);
    return undefined as unknown as T;
  };

  const tryCatch = <T>(delegate: () => T, isAsyncOrProps: (boolean | TryCatchProps<T>) = false): T => {
    const props = (typeof (isAsyncOrProps) === 'boolean' ? { isAsync: isAsyncOrProps } : isAsyncOrProps) ?? {};
    try {
      const result = delegate();
      if (result instanceof Promise) {
        return result.catch(err => handleError(err, { ...props, isAsync: true })) as unknown as T;
      } else {
        return result;
      }
    } catch (err) {
      return handleError(err as Error, props);
    }
  };

  // useEffect(() => registerOnError((props?: OnErrorProps) => {
  //   if (isUnmountedRef.current) return;
  //   if (props != null) callbacks.forEach(callback => callback(props));
  //   if (props?.occurredWithinThisBoundary && errorIsRequestedRef.current) forceUpdate(); // refresh this component if the error has been requested
  // }), []);

  // const onError = useCallback((handler: (props: OnErrorProps) => void) => callbacks.add(handler), []);

  return {
    // get error() { errorIsRequestedRef.current = true; return getError(); },
    // onError,
    // resetError,
    recordError,
    tryCatch,
  };
}