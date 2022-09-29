import { useState } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

export function useForceUpdate(): () => void {
  const [, setValue] = useState({});
  const isUnmounted = useOnUnmount();
  return useBound(() => {
    if (isUnmounted()) return;
    setValue({});
  });
}
