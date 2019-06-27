import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBound } from '../useBound';

interface IOptions {
  triggerOnUnmount?: boolean;
}

export function useTimeout(delegate: () => void, timeout: number, options?: IOptions): () => void {
  options = {
    triggerOnUnmount: false,
    ...options,
  };

  const timeoutRef = useRef(null);
  timeoutRef.current = setTimeout(delegate, timeout);

  const cancelTimeout = useBound(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
    timeoutRef.current = null;
  });

  useOnUnmount(() => {
    if (options.triggerOnUnmount && timeoutRef.current) { delegate(); }
    cancelTimeout();
  });

  return cancelTimeout;
}
