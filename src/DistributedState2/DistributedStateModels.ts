export interface DistributedStateChangeMeta {
  reason?: string;
}

export type OnDistributedStateChangeCallback<TState, TStateChangeMeta extends DistributedStateChangeMeta> = (state: TState, meta: TStateChangeMeta) => void;

export type OnDistributedStateTransformMeta<TStateChangeMeta> = (meta: DistributedStateChangeMeta) => TStateChangeMeta;
