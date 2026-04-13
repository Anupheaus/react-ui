import { useLayoutEffect, useRef, useState } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

export function useForceUpdate() {
  const [, setValue] = useState({});
  const isUnmounted = useOnUnmount();
  const isRenderingRef = useRef(true);
  const shouldUpdateStateRef = useRef(false);
  isRenderingRef.current = true;

  const update = useBound(() => {
    if (isUnmounted()) return;
    if (isRenderingRef.current) {
      // Mark that a re-render is needed after this render commits.
      // The useLayoutEffect below will pick this up and trigger the follow-up render.
      // We also schedule a setTimeout as a fallback in case the render is a concurrent
      // render chunk that doesn't commit (e.g. React yields mid-tree and the subscription
      // update fires during the yield window, not during the component function itself).
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
    if (isUnmounted()) return;
    update();
  });

  return update;
}
