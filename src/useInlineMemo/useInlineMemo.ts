import { SharedHookState } from '../useSharedHookState';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { useRef } from 'react';
import { IMap } from 'anux-common';
import { useOnUnmount } from '../useOnUnmount';
import { areShallowEqual } from '../areEqual';

interface IInlineMemoData {
  dependencies: any[];
  lastValue: any;
}

export type InlineMemo = <TResult, TDelegate extends () => TResult = () => TResult>(delegate: TDelegate, dependencies?: any[]) => TResult;

export function useInlineMemo(sharedHookState: SharedHookState): InlineMemo {
  const [createKey] = useInlineKeyCreator(sharedHookState);
  const dataStoreRef = useRef<IMap<IInlineMemoData>>({});

  useOnUnmount(() => {
    dataStoreRef.current = null; // free up all data
  });

  const memo: InlineMemo = <TResult, TDelegate extends () => TResult = () => TResult>(delegate: TDelegate, dependencies?: any[]): TResult => {
    if (!dataStoreRef.current) { throw new Error('This function was called after this component has been unmounted.'); }
    const key = createKey();
    const data = dataStoreRef.current[key] = dataStoreRef.current[key] || { dependencies } as IInlineMemoData;
    if (!Reflect.has(data, 'lastValue') || !areShallowEqual(data.dependencies, dependencies)) { data.lastValue = delegate(); }
    return data.lastValue;
  };

  return memo;
}
