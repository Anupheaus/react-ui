import { useRef } from 'react';
import { MapOf } from 'anux-common';

type LoopBoundFunc<TItem, TFunc extends Function> = (item: TItem, index: number) => TFunc;

interface LoopBoundCachedItemType<TFunc extends Function> {
  cachedFunc: TFunc;
  func: Function;
}

export function useLoopBound<TItem, TFunc extends Function>(delegate: LoopBoundFunc<TItem, TFunc>): LoopBoundFunc<TItem, TFunc> {
  const cache = useRef<MapOf<LoopBoundCachedItemType<TFunc>>>({});

  return (item, index) => {
    const key = `item-${index}`;
    let currentCache = cache.current[key];
    if (!currentCache) {
      currentCache = cache.current[key] = {
        cachedFunc: ((...args: unknown[]) => cache.current[key].func(...args)) as unknown as TFunc,
        func: undefined,
      };
    }
    currentCache.func = delegate(item, index);
    return currentCache.cachedFunc;
  };
}
