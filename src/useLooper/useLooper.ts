import { ReactElement } from 'react';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { SharedHookState } from '../useSharedHookState';

type Looper = <T, R extends ReactElement | null>(values: T[], delegate: (item: T, key: string, index: number) => R) => R[];

export function useLooper(sharedHookState: SharedHookState): Looper {
  const loopIndexes: number[] = [];
  const [createKey, updateKeySuffix] = useInlineKeyCreator(sharedHookState);

  const setKeySuffix = () => {
    updateKeySuffix(loopIndexes.join('-'));
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

  const looper: Looper = (values, delegate) => {
    addNewLoop();
    const results = values.map((item, index) => {
      updateLoopData(index);
      const key = createKey({ skipTraceFrames: 1 });
      return delegate(item, key, index);
    });
    removeLoop();
    return results;
  };

  return looper;
}