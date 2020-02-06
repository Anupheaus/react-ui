import { useRef, useEffect } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBound } from '../useBound';

interface IOptions {
  triggerOnUnmount?: boolean;
  dependencies?: unknown[];
}

export function useTimeout(delegate: () => void, timeout: number, options?: IOptions): () => void {
  options = {
    triggerOnUnmount: false,
    dependencies: [],
    ...options,
  };

  const timeoutRef = useRef(null);

  const cancelTimeout = useBound(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
    timeoutRef.current = null;
  });

  useEffect(() => {
    cancelTimeout();
    timeoutRef.current = setTimeout(delegate, timeout);
  }, options.dependencies);

  useOnUnmount(() => {
    if (options.triggerOnUnmount && timeoutRef.current) { delegate(); }
    cancelTimeout();
  });

  return cancelTimeout;
}
