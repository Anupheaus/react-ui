import { AnyFunction, MapOf } from '@anupheaus/common';
import { MutableRefObject, useRef } from 'react';

// interface BinderCache<T> {
//   cachedFunc: T | undefined;
//   func: T;
// }

// export function useBound<T extends Function>(delegate: T): T {
//   const cache = useRef<BinderCache<T>>({ cachedFunc: undefined, func: delegate });

//   // get or create cached function
//   const cachedFunc = cache.current.cachedFunc ?? ((...args: unknown[]) => cache.current.func(...args)) as unknown as T;
//   if (!cache.current.cachedFunc) {
//     Reflect.defineProperty(cachedFunc, 'delegate', { value: delegate.toString(), configurable: true, writable: false, enumerable: true });
//     cache.current.cachedFunc = cachedFunc;
//   }
//   // assign the func to the cache
//   cache.current.func = delegate;

//   return cachedFunc; // always return the cached function
// }

interface BinderCache<T> {
  cachedFunc: T | undefined;
  func: T;
}

type Cache<T> = MutableRefObject<BinderCache<T>>;

function bind<T extends Function>(delegate: T, cache: Cache<T>): T {
  // get and/or create cached function  
  let cachedFunc = cache.current.cachedFunc;
  if (!cachedFunc) {
    cachedFunc = cache.current.cachedFunc = ((...args: unknown[]) => cache.current.func(...args)) as unknown as T;
    Reflect.defineProperty(cachedFunc, 'toString', { value: () => cache.current.func.toString(), enumerable: true, configurable: true, writable: false });
  }
  // assign the func to the cache
  cache.current.func = delegate;
  return cachedFunc; // always return the cached function
}

function stringifyArgs(args: any[], delegate: AnyFunction): string {
  try {
    return `delegated-bound-${Object.stringify(args)}`;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error stringifying args for useDelegatedBound', { error, args, delegate });
    return Math.uniqueId();
  }
}

export function useBound<T extends Function>(delegate: T): T {
  const cache = useRef<BinderCache<T>>({ cachedFunc: undefined, func: delegate });
  return bind(delegate, cache);
}

export function useDelegatedBound<T extends AnyFunction>(delegate: T): T {
  const cache = useRef<MapOf<Cache<AnyFunction>>>({});

  return ((...args) => {
    const key = stringifyArgs(args, delegate);
    const func = delegate(...args);
    const currentCache = cache.current[key] = cache.current[key] ?? { current: { cachedFunc: undefined, func } };
    return bind(func, currentCache);
  }) as T;
}
