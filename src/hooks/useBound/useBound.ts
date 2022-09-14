import { useRef } from 'react';

interface BinderCache<T> {
  cachedFunc: T | undefined;
  func: T;
}

export function useBound<T extends Function>(delegate: T): T {
  const cache = useRef<BinderCache<T>>({ cachedFunc: undefined, func: delegate });

  // get or create cached function
  const cachedFunc = cache.current.cachedFunc ?? ((...args: unknown[]) => cache.current.func(...args)) as unknown as T;
  if (!cache.current.cachedFunc) {
    Reflect.defineProperty(cachedFunc, 'delegate', { value: delegate.toString(), configurable: true, writable: false, enumerable: true });
    cache.current.cachedFunc = cachedFunc;
  }
  // assign the func to the cache
  cache.current.func = delegate;

  return cachedFunc; // always return the cached function
}