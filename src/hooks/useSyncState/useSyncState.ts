import { useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { is } from '@anupheaus/common';
import { useForceUpdate } from '../useForceUpdate';

interface SyncState<S> {
  state: S;
  setState(state: S): void;
  setState(update: (state: S) => S): void;
  getState(): S;
}

export function useSyncState<S>(): SyncState<S | undefined>;
export function useSyncState<S>(initialState: () => S): SyncState<S>;
export function useSyncState<S>(initialState?: () => S): SyncState<S | undefined> {
  const stateRef = useRef<S | undefined>(useMemo(() => initialState?.(), []));
  const refresh = useForceUpdate();

  const setState = useBound((arg: S | ((state: S | undefined) => S)) => {
    const newState = (() => {
      if (is.function(arg)) return arg(stateRef.current);
      else return arg;
    })();
    if (is.deepEqual(stateRef.current, newState)) return;
    stateRef.current = newState;
    refresh();
  });

  const getState = useBound(() => stateRef.current);

  return {
    state: stateRef.current,
    setState,
    getState,
  } as SyncState<S | undefined>;
}
