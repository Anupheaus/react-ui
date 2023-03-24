import { useLayoutEffect, useRef, useState } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

interface Props {
  ifNotDoneNaturallyWithin?: number;
}

export function useForceUpdate(): (props?: Props) => void {
  const [, setValue] = useState({});
  const isUnmounted = useOnUnmount();
  const hasRefreshedRef = useRef(false);

  const update = useBound(({ ifNotDoneNaturallyWithin }: Props = {}) => {
    if (isUnmounted()) return;
    if ((ifNotDoneNaturallyWithin ?? 0) > 0) {
      hasRefreshedRef.current = false;
      setTimeout(() => {
        if (hasRefreshedRef.current) return;
        update();
      }, ifNotDoneNaturallyWithin);
    } else {
      setValue({});
    }
  });

  useLayoutEffect(() => {
    hasRefreshedRef.current = true;
  });

  return update;
}
