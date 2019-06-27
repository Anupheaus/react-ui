import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBound } from '../useBound';

interface IOptions {
  triggerOnUnmount?: boolean;
}

export function useInterval(delegate: () => void, interval: number, options?: IOptions): () => void {
  options = {
    triggerOnUnmount: false,
    ...options,
  };

  const intervalRef = useRef(null);
  intervalRef.current = setInterval(delegate, interval);

  const cancelInterval = useBound(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); }
    intervalRef.current = null;
  });

  useOnUnmount(() => {
    if (options.triggerOnUnmount && intervalRef.current) { delegate(); }
    cancelInterval();
  });

  return cancelInterval;
}
