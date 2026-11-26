import { useMemo, useRef as useReactRef } from 'react';

export function useRef<T>(delegate: () => T) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- lazy initialiser: the delegate is only ever run once
  return useReactRef(useMemo(delegate, []));
}
