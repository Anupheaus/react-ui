import { ConstructorOf, IMap } from 'anux-common';
import { IStoreCreate, createCreateStore } from './createStore';
import { ConstructorOfStore } from './models';
import { Store } from './store';

// @ts-ignore
type OnLoadParamType<TActionsType extends ConstructorOfStore> = Parameters<InstanceType<TActionsType>['load']>[0];

export interface IStoreActions<TData extends IMap> {
  actions<TStoreType extends ConstructorOfStore<TData>>(delegate: (base: ConstructorOf<Store<TData>>) => TStoreType): IStoreCreate<TData, TStoreType,
    OnLoadParamType<TStoreType>>;
}

export function createStoreActions<TData extends IMap>(data: TData): IStoreActions<TData> & IStoreCreate<TData, undefined, undefined> {
  const storeCreate = createCreateStore<TData, undefined, undefined>(data);

  return {
    actions<TStoreType extends ConstructorOfStore<TData>>(delegate: (base: ConstructorOf<Store<TData>>) => TStoreType) {
      const StoreType = delegate(Store) as TStoreType;
      return createCreateStore<TData, TStoreType, OnLoadParamType<TStoreType>>(data, StoreType);
    },
    ...storeCreate,
  };
}
