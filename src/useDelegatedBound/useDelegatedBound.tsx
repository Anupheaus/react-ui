/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import { MapOf } from 'anux-common';

type DelegatedBoundFunc = (...args: any[]) => (...innerArgs: any[]) => any;

type AnonymousFunction = (...args: any[]) => any;
type AddKeyToDelegatedBoundFunc<TFunc extends AnonymousFunction> = (key: string | number, ...args: Parameters<TFunc>) => ReturnType<TFunc>;

interface LoopBoundCachedItemType {
  cachedFunc: Function;
  func: Function;
}

export function useDelegatedBound<TFunc extends DelegatedBoundFunc>(delegate: TFunc): AddKeyToDelegatedBoundFunc<TFunc> {
  const cache = useRef<MapOf<LoopBoundCachedItemType>>({});

  return ((providedKey, ...args) => {
    const key = `delegated-bound-${providedKey}`;
    const currentCache = cache.current[key] = cache.current[key] ?? {
      cachedFunc: (...innerArgs: any[]) => cache.current[key].func(...innerArgs),
      func: undefined,
    };
    currentCache.func = delegate(...args);
    return currentCache.cachedFunc;
  }) as AddKeyToDelegatedBoundFunc<TFunc>;
}
