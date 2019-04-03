import { useEffect, useRef, RefObject } from 'react';

export function useOnUnmount(): RefObject<boolean>;
export function useOnUnmount(delegate: () => void): RefObject<boolean>;
export function useOnUnmount(delegate?: () => void): RefObject<boolean> {
  const hasUnmountedRef = useRef(false);

  useEffect(() => () => {
    hasUnmountedRef.current = true;
    if (typeof (delegate) === 'function') { delegate(); }
  }, []);

  return hasUnmountedRef as RefObject<boolean>;
}
