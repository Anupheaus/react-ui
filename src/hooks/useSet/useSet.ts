import { useRef } from '../useRef';

export function useSet<T>() {
  return useRef(() => new Set<T>()).current;
}
