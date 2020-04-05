import { useRef, useMemo } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBound } from '../useBound';

interface IOptions {
  triggerOnUnmount?: boolean;
  dependencies?: unknown[];
}

const emptyArray: unknown[] = [];

export function useInterval(delegate: () => void, interval: number, { dependencies = emptyArray, triggerOnUnmount = false }: IOptions = {}): () => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intervalRef = useRef<any>();

  const cancelInterval = useBound(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); }
    intervalRef.current = null;
  });

  useMemo(() => {
    cancelInterval();
    intervalRef.current = setInterval(delegate, interval);
  }, dependencies);

  useOnUnmount(() => {
    if (triggerOnUnmount && intervalRef.current) { delegate(); }
    cancelInterval();
  });

  return cancelInterval;
}
