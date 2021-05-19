import { useState } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

export interface UseAsyncState {
  onCancelled(delegate: () => void): void;
  hasBeenCancelled(): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncDelegate<ResultType = any> = (state: UseAsyncState, ...args: any[]) => Promise<ResultType>;

type GetParametersOfDelegate<T> = T extends (state: UseAsyncState, ...args: infer R) => unknown ? R : never;

export type UseAsyncTrigger<DelegateType extends AsyncDelegate> = (...args: GetParametersOfDelegate<DelegateType>) => ReturnType<DelegateType>;
export type UseAsyncResponse<T> = T extends (...args: unknown[]) => Promise<infer R> ? R : never;
export type UseAsyncCancel = () => Promise<void>;
export type UseAsyncOnCancelled = (handler: () => void) => void;
export interface UseAsyncResult<DelegateType extends AsyncDelegate> {
  response: UseAsyncResponse<DelegateType>;
  isBusy: boolean;
  trigger: UseAsyncTrigger<DelegateType>;
  cancel: UseAsyncCancel;
  onCancelled: UseAsyncOnCancelled;
}

export interface UseAsyncOptions {
  cancelCurrentRequestOnInvocation?: 'never' | 'whenSameParamsAreUsed' | 'always';
}

interface InternalState {
  isBusy: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
}

export function useAsync<DelegateType extends AsyncDelegate>(delegate: DelegateType): UseAsyncResult<DelegateType> {
  let request: ReturnType<DelegateType> | undefined;
  let isCancelled = false;
  const onCancelledHandlers: (() => void)[] = [];
  const [{ isBusy, response }, setState] = useState<InternalState>({ isBusy: false, response: undefined });

  const cancel = async () => {
    if (!request) return;
    isCancelled = true;
    const tempRequest = request;
    onCancelledHandlers.forEach(handler => handler());
    onCancelledHandlers.clear();
    request = undefined;
    await tempRequest;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateState({ isBusy: false });
  };

  const isUnmounted = useOnUnmount(() => {
    cancel();
  });

  const updateState = (state: Partial<InternalState>): void => {
    if (isUnmounted.current) { return; } // no need to update the busy flag as we are unmounting.
    setState(s => ({ ...s, ...state }));
  };

  const reset = (result: unknown) => {
    request = undefined;
    updateState({ isBusy: false, response: result });
    return result;
  };

  const onCancelled = (handler: () => void): void => {
    if (onCancelledHandlers.includes(handler)) { return; }
    onCancelledHandlers.push(handler);
  };

  const trigger = useBound<UseAsyncTrigger<DelegateType>>((...args) => {
    cancel();
    updateState({ isBusy: true });
    const state: UseAsyncState = {
      hasBeenCancelled: () => isCancelled,
      onCancelled,
    };

    request = delegate(state, ...args) as ReturnType<DelegateType>;
    request.then(reset);
    return request;
  }) as UseAsyncTrigger<DelegateType>;

  return { trigger, response, isBusy, cancel, onCancelled };
}
