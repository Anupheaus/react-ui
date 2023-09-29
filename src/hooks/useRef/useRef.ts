import { useMemo, useRef as useReactRef } from 'react';

export function useRef<T>(delegate: () => T) {
  return useReactRef(useMemo(delegate, []));
}
