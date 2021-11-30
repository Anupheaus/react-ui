import { createContext, useContext as useReactContext, useLayoutEffect, useMemo, useRef } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';

interface AnuxContext<T> {
  isValid: boolean;
  value: T;
  set(change: (value: T) => T): void;
  onChanged(delegate: (value: T) => void): void;
}

interface ProviderProps<T> {
  value: T;
  onChanged(value: T): void;
}

export function createAnuxContext<T>(name: string) {
  const Context = createContext<AnuxContext<T>>({
    isValid: false,
    value: undefined as unknown as T,
    set: () => void 0,
    onChanged: () => void 0,
  });

  const Provider = anuxPureFC<ProviderProps<T>>(`${name}Provider`, ({
    value,
    onChanged,
    children = null,
  }) => {
    const callbacks = useRef(new Set<(value: T) => void>()).current;

    function saveOnChanged(delegate: (value: T) => void): void {
      useLayoutEffect(() => {
        callbacks.add(delegate);
        delegate(context.value);
        return () => { callbacks.delete(delegate); };
      });
    }

    const set = useBound((change: (value: T) => T) => {
      const oldValue = context.value;
      context.value = change(oldValue);
      if (Reflect.areDeepEqual(oldValue, context.value)) return;
      callbacks.forEach(callback => callback(context.value));
      onChanged(context.value);
    });

    const context = useMemo<AnuxContext<T>>(() => ({
      isValid: true,
      value,
      set,
      onChanged: saveOnChanged,
    }), []);

    set(() => value);

    return (
      <Context.Provider value={context}>
        {children}
      </Context.Provider>
    );
  });

  function useContext() {
    const context = useReactContext(Context);
    if (!context.isValid) throw new Error('This context does not have a valid provider available for it.');

    return {
      get value() {
        const update = useForceUpdate();
        context.onChanged(() => update());
        return context.value;
      },
      get() { return context.value; },
      set: context.set,
      onChanged: context.onChanged,
    };
  }

  return {
    Provider,
    useContext,
  };
}
