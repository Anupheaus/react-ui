import uuid from 'uuid/v4';
import { useRef } from 'react';

export function useId(): string {
  return useRef(uuid()).current;
}