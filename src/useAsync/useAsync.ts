import flatted from 'flatted';
import { useRef, useState } from 'react';
import { MapOf } from 'anux-common';
import { useBinder } from '../useBinder';
import { useOnUnmount } from '../useOnUnmount';
import { useId } from '../useId';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncDelegate<ResultType> = (...args: any[]) => Promise<ResultType>;

export interface AsyncDelegateState {
  onCancelled(delegate: () => void): void;
  hasBeenCancelled(): boolean;
}

type UseAsyncDelegate<ResultType, DelegateType extends AsyncDelegate<ResultType>> = (state: AsyncDelegateState) => DelegateType;

type ArgumentTypes<T> = T extends (...args: infer U) => unknown ? U : never;
type ReplaceReturnType<T, R> = (...a: ArgumentTypes<T>) => R;

export type UseAsyncDelegateResultType<ResultType = unknown> =
  Promise<ResultType> & { isCancelled: boolean; cancel(): void };

export type WrappedAsyncDelegate<ResultType = unknown, DelegateType extends AsyncDelegate<ResultType> = AsyncDelegate<ResultType>> =
  ReplaceReturnType<DelegateType, UseAsyncDelegateResultType<ResultType>>;

export type UseAsyncResultType<ResultType = unknown, DelegateType extends AsyncDelegate<ResultType> = AsyncDelegate<ResultType>> =
  [WrappedAsyncDelegate<ResultType, DelegateType>, boolean, () => void];

function createRequestFrom<ResultType = unknown>(result: Promise<ResultType>, hasBeenCancelled: () => boolean, cancel: () => void): UseAsyncDelegateResultType<ResultType> {
  Object.defineProperties(result, {
    cancel: {
      value: cancel,
      enumerable: true,
      configurable: false,
      writable: false,
    },
    isCancelled: {
      get: hasBeenCancelled,
      enumerable: true,
      configurable: false,
    },
  });

  return result as unknown as UseAsyncDelegateResultType<ResultType>;
}

export interface UseAsyncOptions {
  cancelCurrentRequestOnInvocation?: 'never' | 'whenSameParamsAreUsed' | 'always';
}

export function useAsync<ResultType, DelegateType extends AsyncDelegate<ResultType>>(delegate: UseAsyncDelegate<ResultType, DelegateType>,
  options?: UseAsyncOptions): UseAsyncResultType<ResultType, DelegateType> {
  const { cancelCurrentRequest } = {
    cancelCurrentRequest: 'never',
    ...options,
  };
  const bind = useBinder();
  const globalId = useId();
  const [isBusy, setBusy] = useState(false);

  type RequestType = UseAsyncDelegateResultType<ResultType>;

  const requestsRef = useRef<MapOf<RequestType>>({});

  const cancelAll = bind(() => Object.values<RequestType>(requestsRef.current).forEach(request => request.cancel()));

  const isUnmounted = useOnUnmount(cancelAll);

  const updateBusy = () => {
    if (isUnmounted.current) { return; } // no need to update the busy flag as we are unmounting.
    setBusy(Object.keys(requestsRef.current).length > 0);
  }

  const getRequest = (id: string) => requestsRef.current[id];
  const saveRequest = (id: string, request: RequestType) => { requestsRef.current[id] = request; updateBusy(); }
  const removeRequest = (id: string) => { delete requestsRef.current[id]; updateBusy(); };

  const trigger = bind<WrappedAsyncDelegate<ResultType, DelegateType>>((...args) => {
    const id = cancelCurrentRequest === 'whenSameParamsAreUsed' ? flatted.stringify(args).hash() : globalId;
    const existingRequest = getRequest(id);
    let onCancelledHandler: () => void = () => void 0;

    if (existingRequest) {
      if (cancelCurrentRequest === 'never') { return existingRequest; }
      if (cancelCurrentRequest === 'whenSameParamsAreUsed') { existingRequest.cancel(); }
    }
    let isCancelled = false;
    const cancel = () => {
      isCancelled = true;
      removeRequest(id);
      onCancelledHandler();
    };
    const state: AsyncDelegateState = {
      hasBeenCancelled: () => isCancelled,
      onCancelled: handler => { onCancelledHandler = handler; },
    };
    const request = createRequestFrom<ResultType>(delegate(state)(...args), state.hasBeenCancelled, cancel);
    saveRequest(id, request);
    request.finally(() => removeRequest(id));
    return request;
  });

  return [trigger, isBusy, cancelAll];
}
