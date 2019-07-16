import { IMap } from 'anux-common';
import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { SharedHookState } from '../useSharedHookState';

interface IInlineDelegate {
  delegate(...args: unknown[]): unknown;
  func(...args: unknown[]): unknown;
}

export type Binder = <TDelegate extends (...args: any[]) => any>(delegate: TDelegate) => TDelegate;

export function useBinder(sharedHookState: SharedHookState): Binder {
  const [createKey] = useInlineKeyCreator(sharedHookState);
  const delegateStoreRef = useRef<IMap<IInlineDelegate>>({});

  useOnUnmount(() => {
    setTimeout(() => { // free up all bound functions after all synchronous code has been completed.
      delegateStoreRef.current = null;
    }, 0);
  });

  const createFunc = (key: string) => (...args: any[]) => {
    if (!delegateStoreRef.current) { throw new Error('This function was called after this component has been unmounted.'); }
    return delegateStoreRef.current[key].delegate(...args);
  };

  const binder: Binder = <TDelegate extends (...args: any[]) => any>(delegate: TDelegate): TDelegate => {
    const key = createKey();
    const data = delegateStoreRef.current[key] = delegateStoreRef.current[key] || { delegate, func: createFunc(key) };
    data.delegate = delegate;
    return data.func as TDelegate;
  };

  return binder;
}
