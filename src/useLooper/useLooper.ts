import { ReactElement } from 'react';
import { useInlineKeyCreator } from '../useInlineKeyCreator';
import { SharedHookState } from '../useSharedHookState';

interface ILoopData {
  key: string;
  index: number;
}

type Looper = <T, R extends ReactElement | null>(values: T[], delegate: (item: T, key: string, index: number) => R) => R[];

export function useLooper(sharedHookState: SharedHookState): Looper {
  const loopData: ILoopData[] = [];
  const [createKey, updateKeySuffix] = useInlineKeyCreator(sharedHookState);

  const setKeySuffix = () => {
    const { key = undefined, index = undefined } = loopData[loopData.length - 1] || {};
    updateKeySuffix(loopData.length === 0 ? '' : `[${key}:${index}]`);
  };

  const addNewLoop = (key: string) => {
    loopData.push({ key, index: -1 });
  };

  const updateLoopData = (index: number) => {
    const currentData = loopData[loopData.length - 1];
    loopData[loopData.length - 1] = {
      ...currentData,
      index,
    };
    setKeySuffix();
  };

  const removeLoop = () => {
    loopData.pop();
    setKeySuffix();
  };

  const looper: Looper = (values, delegate) => {
    const key = createKey();
    addNewLoop(key);
    const results = values.map((item, index) => {
      updateLoopData(index);
      return delegate(item, `${key}-${index}`, index);
    });
    removeLoop();
    return results;
  };

  return looper;
}