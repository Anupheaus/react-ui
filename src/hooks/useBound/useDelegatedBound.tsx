/* eslint-disable @typescript-eslint/no-explicit-any */
import { is } from '@anupheaus/common';
import { stringify } from 'flatted';
import { useRef } from 'react';

type DelegatedBoundFunc = (...args: any[]) => (...innerArgs: any[]) => any;

interface LoopBoundCachedItemType {
  cachedFunc: Function;
  func: Function;
}

const replacer = (key: string, value: unknown) => is.function(value) ? value.toString() : value;

export function useDelegatedBound<TFunc extends DelegatedBoundFunc>(delegate: TFunc): TFunc {
  const cache = useRef<Map<string, LoopBoundCachedItemType>>(new Map()).current;

  return ((...args) => {
    const key = args.map(arg => stringify(arg, replacer)).join('|').hash();
    let data = cache.get(key);
    if (!data) {
      data = {
        cachedFunc: (...innerArgs: unknown[]) => cache.get(key)?.func(...innerArgs),
        func: undefined as unknown as Function,
      };
      cache.set(key, data);
    }
    data.func = delegate(...args);
    return data.cachedFunc;
  }) as TFunc;
}
