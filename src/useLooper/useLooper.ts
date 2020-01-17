import { ReactElement } from 'react';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { useSharedHookState } from '../useSharedHookState';

interface ILooperOptions {
  key?: string;
  debug?: boolean;
}

type Looper = <T, R extends ReactElement | null>(values: T[], delegate: (item: T, key: string, index: number) => R, options?: ILooperOptions) => R[];

export function useLooper(): Looper {
  const loopIndexes: number[] = [];
  const [createKey, updateKeySuffix] = useInlineKeyCreator(useSharedHookState());

  const setKeySuffix = () => {
    updateKeySuffix(loopIndexes.length === 0 ? '' : `[${loopIndexes.join('-')}]`);
  };

  const addNewLoop = () => {
    loopIndexes.push(0);
  };

  const updateLoopData = (index: number) => {
    loopIndexes[loopIndexes.length - 1] = index;
    setKeySuffix();
  };

  const removeLoop = () => {
    loopIndexes.pop();
    setKeySuffix();
  };

  const looper: Looper = (values, delegate, options) => {
    const { key: from, debug }: ILooperOptions = {
      key: delegate.toString(),
      debug: false,
      ...options,
    };
    addNewLoop();
    const results = values.map((item, index) => {
      updateLoopData(index);
      const key = createKey({ from, debug });
      return delegate(item, key, index);
    });
    removeLoop();
    return results;
  };

  return looper;
}