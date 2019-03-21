import { useEffect, useRef, MutableRefObject } from 'react';

export function useOnUnmount(): MutableRefObject<boolean>;
export function useOnUnmount(delegate: () => void): MutableRefObject<boolean>;
export function useOnUnmount(delegate?: () => void): MutableRefObject<boolean> {
  const hasUnmountedRef = useRef(false);

  useEffect(() => () => {
    hasUnmountedRef.current = true;
    if (typeof (delegate) === 'function') { delegate(); }
  }, []);

  return hasUnmountedRef;
}
