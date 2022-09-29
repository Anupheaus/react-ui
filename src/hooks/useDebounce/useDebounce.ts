import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';

export function useDebounce<TFunc extends Function>(delegate: TFunc, ms: number): TFunc {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutToken = useRef<any>();

  useOnUnmount(() => clearTimeout(timeoutToken.current));

  return ((...args: unknown[]) => {
    clearTimeout(timeoutToken.current);
    timeoutToken.current = setTimeout(() => {
      delegate(...args);
    }, ms);
  }) as unknown as TFunc;
}