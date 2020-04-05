import { v4 as uuid } from 'uuid';
import { useRef } from 'react';

export function useId(): string {
  return useRef(uuid()).current;
}