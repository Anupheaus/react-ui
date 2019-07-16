import { useRef, useEffect } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { useBinder } from '../useBinder';
import { useSharedHookState } from '../useSharedHookState';

interface IOptions {
  triggerOnUnmount?: boolean;
  dependencies?: any[];
}

export function useTimeout(delegate: () => void, timeout: number, options?: IOptions): () => void {
  options = {
    triggerOnUnmount: false,
    dependencies: [],
    ...options,
  };

  const timeoutRef = useRef(null);
  const sharedHookState = useSharedHookState();
  const bind = useBinder(sharedHookState);

  const cancelTimeout = bind(() => {
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
