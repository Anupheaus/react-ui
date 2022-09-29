import { useRef } from 'react';
import { useForceUpdate } from '../hooks/useForceUpdate';

export function useEnsureRefresh() {
  const innerRefresh = useForceUpdate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutIdRef = useRef<any>();

  const reset = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  };

  reset();

  return () => {
    reset();
    timeoutIdRef.current = setTimeout(() => {
      innerRefresh();
    }, 0);
  };
}