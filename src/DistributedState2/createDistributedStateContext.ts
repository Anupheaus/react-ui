import { createContext, SetStateAction } from 'react';
import { DistributedStateChangeMeta, OnDistributedStateChangeCallback } from './DistributedStateModels';

export interface DistributedStateContext<TState, TStateChangeMeta extends DistributedStateChangeMeta> {
  isValid: boolean;
  get(meta?: TStateChangeMeta): TState;
  set(setState: SetStateAction<TState>, meta?: TStateChangeMeta): void;
  onChange(callback: OnDistributedStateChangeCallback<TState, TStateChangeMeta>): void;
  onTransformMeta(meta: DistributedStateChangeMeta): TStateChangeMeta;
}

export function createDistributedStateContext<TState, TStateChangeMeta extends DistributedStateChangeMeta>() {
  return createContext<DistributedStateContext<TState, TStateChangeMeta>>({
    isValid: false,
    get: () => void 0 as unknown as TState,
    set: () => void 0,
    onChange: () => void 0,
    onTransformMeta: m => m as TStateChangeMeta,
  });
}