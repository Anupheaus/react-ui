import { MutableRefObject, useRef } from 'react';

export type SharedHookState = MutableRefObject<Object>;

export function useSharedHookState(): SharedHookState {
  return useRef({});
}