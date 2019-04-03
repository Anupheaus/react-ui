import { useRef, Dispatch } from 'react';
import { is, DeepPartial } from 'anux-common';

type SetStaticStateAction<S> = DeepPartial<S> | ((prevState: S) => S);
export type SetStaticState<TState extends {}> = Dispatch<SetStaticStateAction<TState>>;

interface IStateWrapper<TState extends {}> {
  values: TState;
  proxy: TState;
}

function updateProxy<TState extends {}>(state: IStateWrapper<TState>) {
  const valueKeys = Reflect.ownKeys(state.values);
  const proxyKeys = Reflect.ownKeys(state.proxy);
  const { added, removed } = proxyKeys.diff(valueKeys, (a, b) => a.toString() === b.toString());
  added.forEach(key => Object.defineProperty(state.proxy, key, {
    get() { return state.values[key]; },
    enumerable: true,
    configurable: true,
  }));
  removed.forEach(key => { delete state.proxy[key]; });
}

export function useStaticState<TState extends {}>(initialState: TState): [TState, SetStaticState<TState>] {
  const state = useRef<IStateWrapper<TState>>({
    values: initialState,
    proxy: undefined,
  });
  const update: SetStaticState<TState> = stateOrDelegate => {
    state.current.values = is.function(stateOrDelegate) ? stateOrDelegate(state.current.values) : Object.merge({}, state.current.values, stateOrDelegate);
    updateProxy(state.current);
    return state.current.proxy as TState;
  };
  if (!state.current.proxy) {
    state.current.proxy = {} as TState;
    updateProxy(state.current);
  }
  return [state.current.proxy as TState, update];
}
