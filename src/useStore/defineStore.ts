import { IMap } from 'anux-common';
import { IStoreActions, createStoreActions } from './storeActions';
import { IStoreCreate } from './createStore';

interface IStoreData {
  data<TData extends IMap>(data: TData): IStoreActions<TData> & IStoreCreate<TData, undefined, undefined>;
}

export function defineStore(): IStoreData {
  return {
    data<TData extends IMap>(data: TData) {
      return createStoreActions(data);
    },
  };
}
