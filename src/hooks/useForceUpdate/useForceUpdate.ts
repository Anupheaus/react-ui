import { useLayoutEffect, useRef, useState } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

interface ForceUpdateProps {
  /**
   * If true, and the component is during a render phase, the force update will not occur.
   */
  lazy?: boolean;
}

export function useForceUpdate() {
  const [, setValue] = useState({});
  const isUnmounted = useOnUnmount();
  const isRenderingRef = useRef(true);
  const shouldUpdateStateRef = useRef(false);
  isRenderingRef.current = true;

  const update = useBound(({ lazy = false }: ForceUpdateProps = {}) => {
    if (isUnmounted()) return;
    if (isRenderingRef.current) {
      if (lazy) return;
      shouldUpdateStateRef.current = true;
      setTimeout(() => {
        if (isUnmounted() || !shouldUpdateStateRef.current) return;
        shouldUpdateStateRef.current = false;
        setValue({});
      }, 0);
    } else {
      setValue({});
    }
  });

  useLayoutEffect(() => {
    isRenderingRef.current = false;
    if (!shouldUpdateStateRef.current) return;
    shouldUpdateStateRef.current = false;
    update();
  });

  return update;
}
