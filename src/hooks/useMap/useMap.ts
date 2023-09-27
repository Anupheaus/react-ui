import { useMemo, useRef } from 'react';

export function useMap<K, V>() {
  return useRef(useMemo(() => new Map<K, V>(), [])).current;
}
