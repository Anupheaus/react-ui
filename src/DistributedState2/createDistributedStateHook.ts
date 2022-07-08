import { is } from 'anux-common';
import { Context, SetStateAction, useContext, useEffect, useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';
import { DistributedStateContext } from './createDistributedStateContext';
import { DistributedStateChangeMeta, OnDistributedStateChangeCallback } from './DistributedStateModels';

const defaultTransformOnGet = <TState, TNewState = TState>(state: TState) => state as unknown as TNewState;
const defaultTransformOnSet = <TState, TNewState = TState>(state: TNewState) => state as unknown as TState;

interface GetStateProps {
  checkObserving?: boolean;
  allowUpdate?: boolean;
}

interface Props<TState, TStateChangeMeta extends DistributedStateChangeMeta, TNewState> {
  transformMeta?(meta: DistributedStateChangeMeta, parentTransformMeta?: (meta: DistributedStateChangeMeta) => TStateChangeMeta): TStateChangeMeta;
  transformOnGet?(state: TState, meta: TStateChangeMeta): TNewState;
  transformOnSet?(state: TNewState, meta: TStateChangeMeta): TState;
  disableUpdates?: boolean;
}

export function createDistributedStateHook<TState, TStateChangeMeta extends DistributedStateChangeMeta = DistributedStateChangeMeta,
  TNewState = TState>(context: Context<DistributedStateContext<TState, TStateChangeMeta>>) {
  return ({ transformMeta: propsTransformMeta, transformOnGet = defaultTransformOnGet, transformOnSet = defaultTransformOnSet, disableUpdates = false }: Props<TState, TStateChangeMeta, TNewState> = {}) => {
    const observeRef = useRef(false);
    const allowUpdatesRef = useRef(false);
    const isOutOfDateRef = useRef(false);
    const callbacks = useRef(new Set<OnDistributedStateChangeCallback<TNewState, TStateChangeMeta>>()).current;
    const { isValid, get: contextGet, set: contextSet, onChange: registerOnChange, onTransformMeta } = useContext(context);
    const transformMeta = (meta: DistributedStateChangeMeta) => propsTransformMeta ? propsTransformMeta(meta, isValid ? onTransformMeta : undefined) : onTransformMeta(meta);
    if (!isValid) throw new Error('DistributedStateHook: state is not available.');
    const update = useForceUpdate();

    const getState = (meta: DistributedStateChangeMeta = { reason: 'get' }) => {
      const newMeta = transformMeta(meta);
      return transformOnGet(contextGet(newMeta), newMeta);
    };

    const currentStateRef = useRef(getState({ reason: 'initialise' }));

    registerOnChange((state, meta) => {
      isOutOfDateRef.current = true;
      if (!observeRef.current) return;
      const newState = transformOnGet(state, meta);
      currentStateRef.current = newState;
      isOutOfDateRef.current = false;
      if (!disableUpdates && allowUpdatesRef.current) update();
      callbacks.forEach(callback => callback(newState, meta));
    });

    const get = useBound((meta: TStateChangeMeta = { reason: 'get' } as TStateChangeMeta) => { if (isOutOfDateRef.current) { currentStateRef.current = getState(meta); isOutOfDateRef.current = false; } return currentStateRef.current; });

    const set = useBound((setState: SetStateAction<TNewState>, meta?: TStateChangeMeta) => {
      const newMeta = meta ?? transformMeta({ reason: 'set' });
      contextSet(currentState => {
        if (is.function(setState)) {
          return transformOnSet(setState(transformOnGet(currentState, newMeta)), newMeta);
        } else {
          return transformOnSet(setState, newMeta);
        }
      }, newMeta);
    });

    const onChange = useBound((delegate: OnDistributedStateChangeCallback<TNewState, TStateChangeMeta>) => {
      observeRef.current = true;
      const boundDelegate = useBound(delegate);
      useMemo(() => callbacks.add(boundDelegate), []);
      useEffect(() => () => { callbacks.delete(boundDelegate); }, []);
    });

    return {
      get state() { observeRef.current = true; allowUpdatesRef.current = true; return get(); },
      get,
      set,
      onChange,
    };
  };
}