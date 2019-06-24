import { PromiseMaybe } from 'anux-common';
import { useState, useEffect, MutableRefObject, Dispatch, SetStateAction } from 'react';
import { saveToState } from '../useApi';
import { useOnUnmount } from '../useOnUnmount';

interface IState<T> {
  isBusy: boolean;
  result: T;
  error: Error;
}

export interface IUseAsync<T = any> extends IState<T> { }

function handleFinishedLoading<T>(setState: Dispatch<SetStateAction<IState<T>>>, isUnmounted: MutableRefObject<boolean>) {
  return (result: T): void => {
    if (isUnmounted.current) { return; }
    setState(s => ({ ...s, isBusy: false, result }));
  };
}

export function useAsync<T = any>(delegate: () => PromiseMaybe<T>, dependencies: ReadonlyArray<any>): IUseAsync<T> {
  const [state, setState] = useState<IState<T>>({
    isBusy: true,
    error: undefined,
    result: undefined,
  });

  const isUnmountedRef = useOnUnmount();

  useEffect(() => {
    const result = delegate();
    if (result instanceof Promise) {
      result
        .then(handleFinishedLoading(setState, isUnmountedRef))
        .catch(saveToState(setState, 'error', isUnmountedRef));
    } else {
      handleFinishedLoading(setState, isUnmountedRef)(result);
    }
  }, dependencies);

  return {
    ...state,
  };
}
