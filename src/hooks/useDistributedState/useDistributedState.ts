import { is } from '@anupheaus/common';
import { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';
import { useCallbacks } from '../useCallbacks';
import { DistributedState, DistributedStateApi } from './DistributedStateModels';

const State = Symbol('DistributionState');
const Callbacks = Symbol('DistributionState');

interface InternalState<T> {
  [State]: T;
  [Callbacks]: ReturnType<typeof useCallbacks>;
}

export function useDistributedState<T>(state: () => T, dependencies?: unknown[]): DistributedStateApi<T>;
export function useDistributedState<T>(state: DistributedState<T>): DistributedStateApi<T>;
export function useDistributedState<T>(arg: DistributedState<T> | (() => T), dependencies: unknown[] = []): DistributedStateApi<T> {
  const createState = is.function(arg) ? arg : undefined;
  const state = (createState ? useRef<any>({ [State]: createState(), [Callbacks]: useCallbacks() }) : arg) as MutableRefObject<InternalState<T>>;
  const update = useForceUpdate();
  const firstRenderRef = useRef(true);
  const { invoke, register } = state.current[Callbacks] as ReturnType<typeof useCallbacks>;

  const get = useBound(() => state.current[State]);
  const observe = useBound(() => register(update));
  const set = useBound((newData: T) => {
    const existingData = state.current[State];
    if (is.deepEqual(newData, existingData)) return;
    state.current[State] = newData;
    invoke();
  });
  const modify = useBound((modifier: (value: T) => T) => set(modifier(state.current[State])));
  const onChange = useBound((handler: (value: T) => void) => register(() => handler(state.current[State])));
  const getAndObserve = useBound(() => { observe(); return get(); });

  useLayoutEffect(() => {
    if (!createState) return;
    if (firstRenderRef.current) { firstRenderRef.current = false; return; }
    set(createState?.());
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