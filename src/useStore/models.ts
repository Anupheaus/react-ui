import { IMap } from 'anux-common';

export type StoreCallback<TData extends IMap = IMap> = (data: TData) => void;

export interface IStore<TData extends IMap, TActions extends IMap> {
  data: TData;
  actions: TActions;
}

export interface IInternalStore<TData extends IMap, TActions extends IMap> extends IStore<TData, TActions> {
  registerCallback(callback: StoreCallback<TData>): () => void;
}
