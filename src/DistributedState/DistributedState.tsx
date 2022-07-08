/* eslint-disable max-classes-per-file */
import { AnyFunction, AnyObject, PromiseMaybe } from 'anux-common';
import { Context as ReactContext, createContext, RefAttributes, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { AnuxFC, anuxPureFC } from '../anuxComponents';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';

interface DistributedStateContext<T> {
  isValidContext: boolean;
  get(): T;
  set(value: T): void;
  set(update: (value: T) => T): void;
  onChange(callback: (value: T) => PromiseMaybe<void>): void;
}

export interface DistributedStateProps<T> {
  value: T;
  onChange?(value: T): PromiseMaybe<void>;
}

export type DistributedState<T> = AnuxFC<DistributedStateProps<T> & RefAttributes<HTMLElement>> & { Context: ReactContext<DistributedStateContext<T>>; };

function isValidComponent(component: AnyObject): boolean {
  if (component == null || typeof (component) !== 'object') return false;
  const keys = Object.keys(component);
  if (!keys.includes('$$typeof') || !keys.includes('type')) return false;
  const typeKeys = Object.keys(component.type);
  if (!typeKeys.includes('$$typeof') || !typeKeys.includes('render')) return false;
  if (typeof (component.type.render) !== 'function') return false;
  return true;
}

function createDistributedStateContext<T>(value: T) {
  if (value instanceof Function) throw new Error('The distributed state cannot be a function.');
  const valueRef = useRef<T>(value);
  const callbacks = useRef(new Set<(value: T) => void>()).current;

  const invokeCallbacks = () => { callbacks.forEach(callback => callback(valueRef.current)); };

  const get = useBound(() => valueRef.current);

  const set = useBound((newValueOrUpdate: T | ((value: T) => T)) => {
    const newValue = typeof newValueOrUpdate === 'function' ? (newValueOrUpdate as AnyFunction)(valueRef.current) : newValueOrUpdate;
    valueRef.current = newValue;
    invokeCallbacks();
  });

  return useMemo<DistributedStateContext<T>>(() => ({
    isValidContext: true,
    get,
    set,
    onChange: (callback: (value: T) => void) => {
      useMemo(() => { callbacks.add(callback); }, []);
      useLayoutEffect(() => () => { callbacks.delete(callback); }, []);
    },
  }), []);
}

function createDistributedStateApi<T>(context: DistributedStateContext<T>) {
  const isObservedRef = useRef(false);
  const { isValidContext, get, set, onChange } = context;
  if (!isValidContext) throw new Error('useDistributedState must be used within a valid provider of the DistributedState');
  const update = useForceUpdate();

  onChange(() => {
    if (!isObservedRef.current) return;
    update();
  });

  const observe = useBound(() => { isObservedRef.current = true; });

  const getAndObserve = useBound(() => { observe(); return get(); });

  return {
    get value() { return getAndObserve(); },
    get,
    set,
    onChange,
    observe,
    getAndObserve,
  };
}

function useDistributedStateFromProvider<T>(state: DistributedState<T>) {
  return createDistributedStateApi(useContext(state.Context));
}

interface Props {

}

function useDistributedStateFromDefaultState<T>(State: DistributedState<T>, defaultState: () => T) {
  const context = createDistributedStateContext(useMemo(() => defaultState(), []));

  const DistributedStateProvider = useMemo(() => anuxPureFC<Props>('DistributedStateProvider', ({
    children = null,
  }) => {
    return (
      <State.Context.Provider value={context}>
        {children}
      </State.Context.Provider>
    );
  }), []);

  return {
    ...createDistributedStateApi(context),
    State: DistributedStateProvider,
  };
}

export function createDistributedState<T>(): DistributedState<T> {
  const Context = createContext<DistributedStateContext<T>>({
    isValidContext: false,
    get: () => { throw new Error('The distributed state is not valid'); },
    set: () => { throw new Error('The distributed state is not valid'); },
    onChange: () => void 0,
  });
  const state = anuxPureFC<DistributedStateProps<T>>('DistributedState', ({
    children = null,
    value,
    onChange,
  }) => {
    const context = createDistributedStateContext(value);

    context.onChange(updatedState => onChange?.(updatedState));

    return (
      <Context.Provider value={context}>
        {children}
      </Context.Provider>
    );
  }) as DistributedState<T>;

  state.Context = Context;

  return state;
}


class DistributedStateFromProviderClass<T> { public useDistributedState() { return useDistributedStateFromProvider<T>(null as unknown as DistributedState<T>); } }
type DistributedStateFromProvider<T> = ReturnType<DistributedStateFromProviderClass<T>['useDistributedState']>;
class DistributedStateFromDefaultStateClass<T> {
  public useDistributedState() { return useDistributedStateFromDefaultState<T>(null as unknown as DistributedState<T>, null as unknown as () => T); }
}
type DistributedStateFromDefaultState<T> = ReturnType<DistributedStateFromDefaultStateClass<T>['useDistributedState']>;

export function useDistributedState<T>(state: DistributedState<T>): DistributedStateFromProvider<T>;
export function useDistributedState<T>(state: DistributedState<T>, defaultState: () => T): DistributedStateFromDefaultState<T>;
export function useDistributedState<T>(...args: unknown[]): unknown {
  const state = args[0] as DistributedState<T>;
  const defaultState = args[1] as () => T;
  if (isValidComponent(state) && state.Context != null) {
    if (typeof (defaultState) === 'function') return useDistributedStateFromDefaultState<T>(state, defaultState);
    return useDistributedStateFromProvider<T>(state);
  }
  throw new Error('useDistributedState must be used with either a DistributedState instance or a default state function');
}