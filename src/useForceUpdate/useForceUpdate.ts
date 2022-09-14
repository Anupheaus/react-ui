import { useState } from 'react';
import { useBound } from '../hooks/useBound';
import { useOnUnmount } from '../useOnUnmount';

export function useForceUpdate(): () => void {
  const [, setValue] = useState({});
  const isUnmountedRef = useOnUnmount();
  return useBound(() => {
    if (isUnmountedRef.current) return;
    setValue({});
  });
}
