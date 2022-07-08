import { is } from 'anux-common';
import { Context, SetStateAction, useContext, useEffect, useMemo, useRef } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useBound } from '../useBound';
import { useOnChange } from '../useOnChange';
import { DistributedStateContext } from './createDistributedStateContext';
import { OnDistributedStateChangeCallback, DistributedStateChangeMeta, OnDistributedStateTransformMeta } from './DistributedStateModels';

const defaultOnTransformMeta = <TStateChangeMeta extends DistributedStateChangeMeta>(meta: DistributedStateChangeMeta) => meta as TStateChangeMeta;

interface InternalSetProps<TState, TStateChangeMeta extends DistributedStateChangeMeta> {
  setState?: SetStateAction<TState>;
  meta?: TStateChangeMeta;
  parentState?: TState;
}

interface Props<TState, TStateChangeMeta extends DistributedStateChangeMeta> {
  state: TState;
  onChange?: OnDistributedStateChangeCallback<TState, TStateChangeMeta>;
  onTransformMeta?: OnDistributedStateTransformMeta<TStateChangeMeta>;
  onInherit?(currentState: TState, parentState: TState, meta: TStateChangeMeta): TState;
}

export function createDistributedStateProvider<TState,
  TStateChangeMeta extends DistributedStateChangeMeta>(ProvidedContext: Context<DistributedStateContext<TState, TStateChangeMeta>>) {
  return anuxPureFC<Props<TState, TStateChangeMeta>>('DistributedStateProvider', ({
    state,
    onChange: propsOnChange,
    onTransformMeta = defaultOnTransformMeta,
    onInherit,
    children = null,
  }) => {
    const stateRef = useRef(state);
    const parentContext = useContext(ProvidedContext);
    const callbacks = useRef(new Set<OnDistributedStateChangeCallback<TState, TStateChangeMeta>>()).current;

    const onChange = useBound((delegate: OnDistributedStateChangeCallback<TState, TStateChangeMeta>) => {
      const boundDelegate = useBound(delegate);
      useMemo(() => callbacks.add(boundDelegate), []);
      useEffect(() => () => { callbacks.delete(boundDelegate); }, []);
    });

    const internalSet = ({ setState = stateRef.current, meta, parentState }: InternalSetProps<TState, TStateChangeMeta>) => {
      const newMeta = meta ?? onTransformMeta({ reason: 'set' });
      let newState = is.function(setState) ? setState(stateRef.current) : setState;
      if (onInherit) newState = onInherit(newState, parentState ?? parentContext.get(newMeta), newMeta);
      if (is.deepEqual(newState, stateRef.current)) return;
      stateRef.current = newState;
      propsOnChange?.(newState, newMeta);
      callbacks.forEach(callback => {
        if (!callbacks.has(callback)) return;
        callback(newState, newMeta);
      });
    };

    parentContext.onChange((parentState, meta) => internalSet({ meta, parentState }));

    useOnChange(() => internalSet({ setState: state, meta: onTransformMeta({ reason: 'newProviderState' }) }), [Object.hash({ state })]);
    useOnChange(() => internalSet({ meta: onTransformMeta({ reason: 'newOnInherit' }) }), [onInherit]);

    const get = useBound(() => stateRef.current);
    const set = useBound((setState: SetStateAction<TState>, meta?: TStateChangeMeta) => internalSet({ setState, meta }));

    const context = useMemo<DistributedStateContext<TState, TStateChangeMeta>>(() => ({
      isValid: true,
      get,
      set,
      onChange,
      onTransformMeta,
    }), []);

    return (
      <ProvidedContext.Provider value={context}>
        {children}
      </ProvidedContext.Provider>
    );
  });
}