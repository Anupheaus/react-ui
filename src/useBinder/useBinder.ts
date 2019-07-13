import { IMap, is } from 'anux-common';
import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { areShallowEqual } from '../areEqual';

interface IInlineDelegate {
  dependencies: any[];
  delegate(...args: unknown[]): unknown;
  func(...args: unknown[]): unknown;
}

interface IBinderConfig {
  key?: string;
  dependencies?: any[];
}

interface IBinder {
  <TDelegate extends (...args: any[]) => any>(delegate: TDelegate, options?: IBinderConfig): TDelegate;
  <TDelegate extends (...args: any[]) => any>(delegate: TDelegate, dependencies?: any[]): TDelegate;
  withinArray<T, R>(values: T[], delegate: (item: T, key: string, index: number) => R): R[];
}

const callStackRegExp = new RegExp(/^\s{4}at\s(.*)$/, 'gmi');

function createKey(): string {
  const errorStack = new Error().stack;
  const matches = errorStack.match(callStackRegExp);
  if (!matches || matches.length < 3) { return; }
  return matches[2];
}


export function useBinder(): IBinder {
  const delegateStoreRef = useRef<IMap<IInlineDelegate>>({});
  const keySuffixes: string[] = [];

  useOnUnmount(() => {
    delegateStoreRef.current = null; // free up all bound functions
  });

  const createFunc = (key: string) => (...args: any[]) => {
    if (!delegateStoreRef.current) { throw new Error('This function was called after this component has been unmounted.'); }
    return delegateStoreRef.current[key].delegate(...args);
  };

  const binder: IBinder = <TDelegate extends (...args: any[]) => any>(delegate: TDelegate, optionsOrDependencies?: IBinderConfig | any[]): TDelegate => {
    let options: IBinderConfig = is.array(optionsOrDependencies) ? { dependencies: optionsOrDependencies } : (optionsOrDependencies || {});
    let {
      key = createKey(),
      dependencies = [],
    } = options || {};

    key += keySuffixes.join('');

    const data = delegateStoreRef.current[key] = delegateStoreRef.current[key] || { delegate, func: createFunc(key), dependencies };
    if (!areShallowEqual(data.dependencies, dependencies)) { data.func = createFunc(key); }
    data.delegate = delegate;

    return data.func as TDelegate;
  };

  binder.withinArray = <T, R>(values: T[], delegate: (item: T, key: string, index: number) => R): R[] => {
    const keySuffixIndex = keySuffixes.length;
    const results = values.map((value, index) => {
      keySuffixes[keySuffixIndex] = `[${index}]`;
      return delegate(value, `item-${index}`, index);
    });
    keySuffixes[keySuffixIndex] = undefined;
    return results;
  };

  return binder;
}
