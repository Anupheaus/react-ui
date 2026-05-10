import { useLayoutEffect, useRef, useState } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

export function useForceUpdate() {
  const [, setValue] = useState({});
  const isUnmounted = useOnUnmount();
  const isRenderingRef = useRef(true);
  const shouldUpdateStateRef = useRef(false);
  const hasMountedRef = useRef(false);
  isRenderingRef.current = true;

  const update = useBound(() => {
    if (isUnmounted()) return;
    if (isRenderingRef.current) {
      // Mark that a re-render is needed after this render commits.
      // The useLayoutEffect below will pick this up and trigger the follow-up render.
      shouldUpdateStateRef.current = true;
      // Only schedule a setTimeout fallback after the component has mounted. Before
      // mount, useLayoutEffect hasn't run yet and will pick up shouldUpdateStateRef on
      // commit — scheduling a setTimeout here would fire before that commit and trigger
      // React's "Can't perform a state update on a component that hasn't mounted" warning.
      if (hasMountedRef.current) {
        setTimeout(() => {
          if (isUnmounted() || !shouldUpdateStateRef.current || !hasMountedRef.current) return;
          shouldUpdateStateRef.current = false;
          setValue({});
        }, 0);
      }
    } else {
      setValue({});
    }
  });

  useLayoutEffect(() => {
    hasMountedRef.current = true;
    isRenderingRef.current = false;
    if (!shouldUpdateStateRef.current) return;
    shouldUpdateStateRef.current = false;
    if (isUnmounted()) return;
    update();
  });

  return update;
}
