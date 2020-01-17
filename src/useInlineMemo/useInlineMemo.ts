import { useRef } from 'react';
import { IMap } from 'anux-common';
import { useSharedHookState } from '../useSharedHookState';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { useOnUnmount } from '../useOnUnmount';
import { areShallowEqual } from '../areEqual';

interface IInlineMemoOptions {
  key?: string;
  dependencies?: any[];
  debug?: boolean;
}

interface IInlineMemoData {
  dependencies: any[];
  lastValue: any;
}

export interface InlineMemo {
  <TResult, TDelegate extends () => TResult = () => TResult>(delegate: TDelegate, dependencies?: any[]): TResult;
  <TResult, TDelegate extends () => TResult = () => TResult>(delegate: TDelegate, options?: IInlineMemoOptions): TResult;
}

export function useInlineMemo(): InlineMemo {
  const [createKey] = useInlineKeyCreator(useSharedHookState());
  const dataStoreRef = useRef<IMap<IInlineMemoData>>({});

  useOnUnmount(() => {
    dataStoreRef.current = null; // free up all data
  });

  function memo<TResult, TDelegate extends () => TResult = () => TResult>(delegate: TDelegate, dependenciesOrOptions?: (any[]) | IInlineMemoOptions): TResult {
    const { key: from, dependencies, debug }: IInlineMemoOptions = {
      key: delegate.toString(),
      dependencies: dependenciesOrOptions instanceof Array ? dependenciesOrOptions : [],
      debug: false,
      ...(dependenciesOrOptions instanceof Array ? {} : dependenciesOrOptions),
    };
    if (!dataStoreRef.current) { throw new Error('This function was called after this component has been unmounted.'); }
    const key = createKey({ from, debug });
    const data = dataStoreRef.current[key] = dataStoreRef.current[key] || { dependencies } as IInlineMemoData;
    if (!Reflect.has(data, 'lastValue') || !areShallowEqual(data.dependencies, dependencies)) { data.lastValue = delegate(); }
    return data.lastValue;
  }

  return memo;
}
