import { useRef, useMemo } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBound } from '../useBound';

interface IOptions {
  triggerOnUnmount?: boolean;
  dependencies?: unknown[];
}

export function useInterval(delegate: () => void, interval: number, options?: IOptions): () => void {
  const { dependencies, triggerOnUnmount } = {
    triggerOnUnmount: false,
    dependencies: [],
    ...options,
  };
  const intervalRef = useRef(null);

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
