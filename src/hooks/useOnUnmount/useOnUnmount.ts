import { useEffect, useRef } from 'react';

export function useOnUnmount(): () => boolean;
export function useOnUnmount(delegate: () => void): () => boolean;
export function useOnUnmount(delegate?: () => void): () => boolean {
  const hasUnmountedRef = useRef(false);
  // The delegate given on the latest render, so the unmount runs that one and not the one captured when it mounted.
  const delegateRef = useRef(delegate);
  delegateRef.current = delegate;

  useEffect(() => () => {
    hasUnmountedRef.current = true;
    const latest = delegateRef.current;
    if (typeof (latest) === 'function') { latest(); }
  }, []);

  return () => hasUnmountedRef.current;
}
