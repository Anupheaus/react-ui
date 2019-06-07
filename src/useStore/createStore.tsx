import { IMap, is } from 'anux-common';
import { FunctionComponent, useState, useContext } from 'react';
import { Store } from './store';
import { StoreContext } from './context';
import { useOnUnmount } from '../useOnUnmount';
import { StoreTypeId, IStore, IProviderProps, StoreActionsDelegate } from './models';
import { useOnMount } from '../useOnMount';

export function createStore<TData extends IMap, TActions extends IMap>(initialData: TData, actions: StoreActionsDelegate<TData, TActions>) {
  const storeTypeId = Math.uniqueId();

  const Provider: FunctionComponent<IProviderProps<TData, TActions>> = ({ children, initialData: providerInitialData, onChanged, onLoad, onLoading, onError }) => {
    const actualInitialData = is.function(providerInitialData) ? providerInitialData(initialData) : (providerInitialData || initialData);
    const store = new Store(actualInitialData, actions);
    const currentContext = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(is.function(onLoad));
    const [error, recordError] = useState<Error>();

    onError = onError || ((displayError: Error) => (<div>An error has occurred within this store: {displayError.message}</div>));

    let unregisterOnChanged: () => void;
    if (onChanged) {
      unregisterOnChanged = store.register(onChanged);
    }
    const storeId = store.id;

    useOnMount(async () => {
      if (onLoad) {
        try {
          await onLoad(store.actions, store.data);
        } catch (error) {
          recordError(error);
        } finally {
          setIsLoading(false);
        }
      }
    });

    useOnUnmount(() => {
      if (unregisterOnChanged) { unregisterOnChanged(); unregisterOnChanged = null; }
      store.dispose();
    });

    const renderError = () => !is.null(error) && is.function(onError) ? onError(error) : null;
    const renderIsLoading = () => !isLoading ? null : onLoading == null ? null : is.function(onLoading) ? onLoading() : onLoading;
    const content = renderError() || renderIsLoading() || children || null;

    return <StoreContext.Provider value={{ ...currentContext, [storeTypeId]: storeId }}>{content}</StoreContext.Provider>;
  };

  Provider[StoreTypeId] = storeTypeId;

  return Provider as IStore<TData, TActions>;
}
