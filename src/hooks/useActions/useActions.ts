import { AnyFunction } from '@anupheaus/common';
import { useEffect, useRef } from 'react';
import { useBound, useDelegatedBound } from '../useBound';

export type UseActions<T extends {}> = (actions: T) => void;

type UseActionsApi<T extends {}> = T & {
  hasActions: boolean;
  setActions: UseActions<T>;
  waitOnActions(timeout?: number): Promise<void>;
  setMappedActions(id: string | number): UseActions<T>;
  getMappedActions(id: string | number): T & { hasActions: boolean; };
};

function useActionsFunc<T extends {}>(): UseActionsApi<T> {
  const actionsRef = useRef<T>();
  const mappedActionsRef = useRef(new Map<string | number, T>());
  const hasUnmountedRef = useRef(false);
  const resolveRef = useRef<() => void>(() => void 0);

  const setActions = useBound((actions: T) => {
    if (!hasUnmountedRef.current) {
      actionsRef.current = actions;
      resolveRef.current();
    }
    useEffect(() => {
      hasUnmountedRef.current = false;
      actionsRef.current = actions;
      return () => {
        actionsRef.current = undefined;
        hasUnmountedRef.current = true;
      };
    }, [actions]);
  });

  const setMappedActions = useDelegatedBound((id: string | number) => (actions: T) => {
    mappedActionsRef.current.set(id, actions);
  });

  const createActionInvoker = useDelegatedBound((property: PropertyKey, getActions: () => T | undefined) => (...args: unknown[]) => {
    const actions = getActions();
    if (actions == null) {
      if (hasUnmountedRef.current) return;
      throw new Error('The actions have been called before having been set.');
    }
    const func = Reflect.get(actions, property) as AnyFunction | undefined;
    if (!func || typeof (func) !== 'function') throw new Error(`The action "${property.toString()}" is not a function.`);
    return func(...args);
  });

  const getMappedActions = useBound((id: string | number) => new Proxy({}, {
    get: (_target, prop) => {
      if (prop === 'hasActions') return mappedActionsRef.current.has(id);
      return createActionInvoker(prop, () => mappedActionsRef.current.get(id));
    },
  }));

  const waitOnActions = useBound(async (timeout = 100) => {
    if (actionsRef.current) return;
    return new Promise<void>((resolve, reject) => {
      resolveRef.current = resolve;
      setTimeout(() => reject(new Error('The timeout expired before the actions have been set.')), timeout);
    });
  });

  return new Proxy({}, {
    get: (_target, prop) => {
      if (prop === 'hasActions') return actionsRef.current != null;
      if (prop === 'setActions') return setActions;
      if (prop === 'setMappedActions') return setMappedActions;
      if (prop === 'getMappedActions') return getMappedActions;
      if (prop === 'waitOnActions') return waitOnActions;
      return createActionInvoker(prop, () => actionsRef.current);
    },
  }) as UseActionsApi<T>;
}

type UseActionsFunc = typeof useActionsFunc & { createDefaultHandler<T extends {}>(): UseActions<T>; };

export const useActions = useActionsFunc as UseActionsFunc;

useActions.createDefaultHandler = () => useRef(() => void 0).current;