import { useUpdatableState } from '../useUpdatableState';

export function useId(id?: string): string {
  return useUpdatableState(() => id ?? Math.uniqueId(), [id])[0];
}