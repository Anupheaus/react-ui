import { PromiseMaybe } from 'anux-common';
import { useState, useEffect, useRef, MutableRefObject, Dispatch, SetStateAction } from 'react';
import { saveToState } from '../useApi';

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
  const isUnmounted = useRef(false);

  const [state, setState] = useState<IState<T>>({
    isBusy: true,
    error: undefined,
    result: undefined,
  });

  useEffect(() => {
    const result = delegate();
    if (result instanceof Promise) {
      result
        .then(handleFinishedLoading(setState, isUnmounted))
        .catch(saveToState(setState, 'error', isUnmounted));
    } else {
      setState(s => ({ ...s, result }));
    }
  }, dependencies);

  useEffect(() => () => { isUnmounted.current = true; });

  return {
    ...state,
  };
}
