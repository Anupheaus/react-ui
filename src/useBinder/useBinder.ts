import { IMap } from 'anux-common';
import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { useSharedHookState } from '../useSharedHookState';

interface IBinderOptions {
  debug?: boolean;
  key?: string;
}

interface IInlineDelegate {
  delegate(...args: unknown[]): unknown;
  func(...args: unknown[]): unknown;
}

export type Binder = <TDelegate extends (...args: any[]) => any>(delegate: TDelegate, options?: IBinderOptions) => TDelegate;

export function useBinder(): Binder {
  const sharedHookState = useSharedHookState();
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

  function binder<TDelegate extends (...args: any[]) => any>(delegate: TDelegate, options?: IBinderOptions): TDelegate {
    const { debug, key: from }: IBinderOptions = {
      debug: false,
      key: delegate.toString(),
      ...options,
    };
    const key = createKey({ from, debug });
    const data = delegateStoreRef.current[key] = delegateStoreRef.current[key] || { delegate, func: createFunc(key) };
    data.delegate = delegate;
    return data.func as TDelegate;
  }

  return binder;
}
