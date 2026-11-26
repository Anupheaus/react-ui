import { useEffect, useRef } from 'react';

export function useOnUnmount(): () => boolean;
export function useOnUnmount(delegate: () => void): () => boolean;
export function useOnUnmount(delegate?: () => void): () => boolean {
  const hasUnmountedRef = useRef(false);

  useEffect(() => () => {
    hasUnmountedRef.current = true;
    if (typeof (delegate) === 'function') { delegate(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup must run only on unmount; it runs the delegate captured at mount
  }, []);

  return () => hasUnmountedRef.current;
}
