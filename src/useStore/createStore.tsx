import { IMap, is } from 'anux-common';
import { FunctionComponent } from 'react';
import { Store } from './store';
import { StoreContext } from './context';
import { useOnUnmount } from '../useOnUnmount';
import { StoreTypeId, IStore, IProviderProps, StoreActionsDelegate } from './models';

export function createStore<TData extends IMap, TActions extends IMap>(initialData: TData, actions: StoreActionsDelegate<TData, TActions>) {
  const storeTypeId = Math.uniqueId();

  const Provider: FunctionComponent<IProviderProps<TData>> = ({ children, initialData: providerInitialData, onChanged }) => {
    const actualInitialData = is.function(providerInitialData) ? providerInitialData(initialData) : (providerInitialData || initialData);
    const store = new Store(actualInitialData, actions);
    let unregisterOnChanged: () => void;
    if (onChanged) {
      unregisterOnChanged = store.register(onChanged);
    }
    const storeId = store.id;

    useOnUnmount(() => {
      if (unregisterOnChanged) { unregisterOnChanged(); unregisterOnChanged = null; }
      store.dispose();
    });

    return <StoreContext.Provider value={{ [storeTypeId]: storeId }}>{children || null}</StoreContext.Provider>;
  };

  Provider[StoreTypeId] = storeTypeId;

  return Provider as IStore<TData, TActions>;
}
