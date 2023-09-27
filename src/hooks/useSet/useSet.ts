import { useMemo, useRef } from 'react';

export function useSet<T>() {
  return useRef(useMemo(() => new Set<T>(), [])).current;
}
