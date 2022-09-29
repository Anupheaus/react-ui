import { useRef } from 'react';

export function useId(): string {
  return useRef(Math.uniqueId()).current;
}