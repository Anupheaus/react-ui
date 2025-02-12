import { useRef } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

export function useDebounce<TFunc extends Function>(delegate: TFunc, ms: number, longestMs = 0): TFunc {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutToken = useRef<any>();
  const lastTimeOccurredRef = useRef(Date.now());

  const hasUnmounted = useOnUnmount(() => clearTimeout(timeoutToken.current));
  const wrappedDelegate = useBound(delegate);

  return useBound((...args: unknown[]) => {
    if (longestMs === 0 || (Date.now() - lastTimeOccurredRef.current) < longestMs) clearTimeout(timeoutToken.current);
    timeoutToken.current = setTimeout(() => {
      if (hasUnmounted()) return;
      lastTimeOccurredRef.current = Date.now();
      wrappedDelegate(...args);
    }, ms);
  }) as unknown as TFunc;
}