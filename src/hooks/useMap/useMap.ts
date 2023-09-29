import { useRef } from '../useRef';

export function useMap<K, V>() {
  return useRef(() => new Map<K, V>()).current;
}
