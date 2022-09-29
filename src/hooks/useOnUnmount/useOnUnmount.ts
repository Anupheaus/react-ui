import { useEffect, useRef } from 'react';

export function useOnUnmount(): () => boolean;
export function useOnUnmount(delegate: () => void): () => boolean;
export function useOnUnmount(delegate?: () => void): () => boolean {
  const hasUnmountedRef = useRef(false);

  useEffect(() => () => {
    hasUnmountedRef.current = true;
    if (typeof (delegate) === 'function') { delegate(); }
  }, []);

  return () => hasUnmountedRef.current;
}
