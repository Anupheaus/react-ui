import { useRef } from 'react';

interface BinderCache {
  cachedFunc: Function | undefined;
  func: Function;
}

export function useBinder() {
  return <T extends any[], R>(delegate: (...args: T) => R): (...args: T) => R => {
    const cache = useRef<BinderCache>({ cachedFunc: undefined, func: delegate });

    // get or create cached function
    const cachedFunc = cache.current.cachedFunc ?? ((...args: unknown[]) => cache.current.func(...args));
    if (!cache.current.cachedFunc) {
      Reflect.defineProperty(cachedFunc, 'delegate', { value: delegate.toString(), configurable: true, writable: false, enumerable: true });
      cache.current.cachedFunc = cachedFunc;
    }
    // assign the func to the cache
    cache.current.func = delegate;

    return cachedFunc as (...args: T) => R; // always return the cached function
  };
}
