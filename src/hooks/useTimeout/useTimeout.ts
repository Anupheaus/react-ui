import { useRef, useMemo } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBound } from '../useBound';

interface UseTimeoutOptions {
  triggerOnUnmount?: boolean;
  dependencies?: unknown[];
}

export function useTimeout(delegate: () => void, timeout: number, { dependencies = [], triggerOnUnmount = false }: UseTimeoutOptions = {}): () => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>();

  const cancelTimeout = useBound(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
    timeoutRef.current = null;
  });

  useMemo(() => {
    cancelTimeout();
    timeoutRef.current = setTimeout(delegate, timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arms only when the caller-supplied dependencies change
  }, dependencies);

  useOnUnmount(() => {
    if (triggerOnUnmount && timeoutRef.current) { delegate(); }
    cancelTimeout();
  });

  return cancelTimeout;
}
