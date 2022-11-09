import { NotPromise, PromiseMaybe, Unsubscribe } from 'anux-common';
import { useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';
import { useOnUnmount } from '../useOnUnmount';

export interface UseAsyncState {
  requestId: string;
  onCancelled(delegate: Unsubscribe): void;
  hasBeenCancelled(): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncDelegate<ResultType = any> = (state: UseAsyncState, ...args: any[]) => PromiseMaybe<ResultType>;

// type GetParametersOfDelegate<T> = T extends (state: UseAsyncState, ...args: infer R) => unknown ? R : never;

export type UseAsyncTrigger<DelegateType extends AsyncDelegate> = (...args: Parameters<DelegateType>) => ReturnType<DelegateType>;
export type UseAsyncResponse<T extends AsyncDelegate> = NotPromise<ReturnType<T>>;
export type UseAsyncCancel = () => void;
export type UseAsyncCancelDelegate = (props: { requestId: string; }) => void;
export type UseAsyncOnCancelled = (handler: UseAsyncCancelDelegate) => void;
export interface UseAsyncResult<DelegateType extends AsyncDelegate> {
  response: UseAsyncResponse<DelegateType> | undefined;
  isLoading: boolean;
  trigger: UseAsyncTrigger<DelegateType>;
  cancel: UseAsyncCancel;
  onCancelled: UseAsyncOnCancelled;
}

interface Props {
  manuallyTriggered?: boolean;
}

export interface UseAsyncOptions {
  cancelCurrentRequestOnInvocation?: 'never' | 'whenSameParamsAreUsed' | 'always';
}

export function useAsync<DelegateType extends AsyncDelegate>(delegate: DelegateType, dependencies: unknown[] = [], { manuallyTriggered = false }: Props = {}): UseAsyncResult<DelegateType> {
  const responseRef = useRef<NotPromise<ReturnType<DelegateType>>>();
  const lastRequestRef = useRef<string>('');
  const onLocalCancelledCallbacks = useRef(new Set<Unsubscribe>()).current;
  const onGlobalCancelledCallbacks = useRef(new Set<UseAsyncCancelDelegate>()).current;
  const isLoadingRef = useRef(false);
  const update = useForceUpdate();

  const isUnmounted = useOnUnmount(() => {
    cancel();
  });

  const cancel = useBound(() => {
    if (lastRequestRef.current === '') return;
    onLocalCancelledCallbacks.forEach(cb => cb());
    onGlobalCancelledCallbacks.forEach(cb => cb({ requestId: lastRequestRef.current }));
    onLocalCancelledCallbacks.clear();
    lastRequestRef.current = '';
  });

  const onCancelled = (onCancelledDelegate: UseAsyncCancelDelegate) => onGlobalCancelledCallbacks.add(onCancelledDelegate);

  const trigger = useBound<UseAsyncTrigger<DelegateType>>((...args) => {
    cancel();
    const requestId = lastRequestRef.current = Math.uniqueId();
    let hasBeenCancelled = false;
    onLocalCancelledCallbacks.add(() => { hasBeenCancelled = true; });
    const state: UseAsyncState = {
      requestId,
      onCancelled: cancelledDelegate => onLocalCancelledCallbacks.add(cancelledDelegate),
      hasBeenCancelled: () => requestId !== lastRequestRef.current || hasBeenCancelled,
    };
    const result = delegate(state, ...args);
    if (result instanceof Promise) {
      isLoadingRef.current = true;
      result.then(value => {
        if (requestId !== lastRequestRef.current || isUnmounted()) return;
        isLoadingRef.current = false;
        if (hasBeenCancelled) return;
        responseRef.current = value;
        update();
      });
    } else {
      responseRef.current = result;
      isLoadingRef.current = false;
    }
    return result;
  });

  useMemo(() => {
    if (manuallyTriggered || trigger.length !== 0) return;
    trigger(...[] as any);
  }, dependencies);

  return {
    trigger,
    get response() { return responseRef.current; },
    get isLoading() { return isLoadingRef.current; },
    cancel,
    onCancelled,
  };
}