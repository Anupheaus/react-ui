import { is } from '@anupheaus/common';
import type { MutableRefObject} from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';
import { useCallbacks } from '../useCallbacks';
import type { DistributedState, DistributedStateApi } from './DistributedStateModels';

interface InternalState<T> {
  state: T;
  callbacks: ReturnType<typeof useCallbacks>;
}

export function useDistributedState<T>(state: () => T, dependencies?: unknown[]): DistributedStateApi<T>;
export function useDistributedState<T>(state: DistributedState<T>): DistributedStateApi<T>;
export function useDistributedState<T>(arg: DistributedState<T> | (() => T), dependencies: unknown[] = []): DistributedStateApi<T> {
  const createState = is.function(arg) ? arg : undefined;
  // Both hooks run every render (even when a shared state is passed in) so the hook order never depends on the argument's shape.
  const callbacks = useCallbacks();
  const ownStateRef = useRef<InternalState<T>>({ state: createState?.() as T, callbacks });
  const state = (createState ? ownStateRef : arg) as MutableRefObject<InternalState<T>>;
  const update = useForceUpdate();
  const firstRenderRef = useRef(true);
  const { invoke, register } = state.current.callbacks;

  const get = useBound(() => state.current.state);
  const observe = useBound(() => register(update));
  const set = useBound((newData: T) => {
    const existingData = state.current.state;
    if (is.deepEqual(newData, existingData)) return;
    state.current.state = newData;
    invoke();
  });
  const modify = useBound((modifier: (value: T) => T) => set(modifier(state.current.state)));
  const onChange = useBound((handler: (value: T) => void) => register(() => handler(state.current.state)));
  const getAndObserve = useBound(() => { observe(); return get(); });

  useLayoutEffect(() => {
    if (!createState) return;
    if (firstRenderRef.current) { firstRenderRef.current = false; return; }
    set(createState?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-creates the state only when the caller-supplied dependencies change
  }, dependencies);

  return {
    state,
    get,
    getAndObserve,
    observe,
    set,
    modify,
    onChange,
  };
}