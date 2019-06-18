import { FunctionComponent, useContext, useState, useMemo, Dispatch, SetStateAction } from 'react';
import { IMap } from 'anux-common';
import { ConstructorOfStore, StoreTypeId } from './models';
import { StoreContext } from './context';
import { Store } from './store';
import { useOnMount } from '../useOnMount';
import { useOnUnmount } from '../useOnUnmount';

interface IProviderProps<TData extends IMap> {
  initialData?: TData;
  onError?(error: Error): JSX.Element;
  onLoading?(): JSX.Element;
}

interface IProviderOnLoadProps<TOnLoad extends IMap> {
  onLoadParameters: TOnLoad;
}

type ProviderProps<TData extends IMap, TOnLoad extends IMap> = TOnLoad extends undefined ? IProviderProps<TData> : IProviderProps<TData> & IProviderOnLoadProps<TOnLoad>;

export interface IProvider<TData extends IMap, TActions extends IMap, TOnLoad extends IMap = any> extends FunctionComponent<ProviderProps<TData, TOnLoad>> {
  dataType: TData;
  actionsType: TActions;
}

interface IProviderState {
  error: Error;
  isLoading: boolean;
}

function renderError(error: Error, onError: (error: Error) => JSX.Element) {
  if (!error || !onError) { return null; }
  return onError(error);
}

function renderPending(isLoading: boolean, onLoading: () => JSX.Element) {
  if (!isLoading || !onLoading) { return null; }
  return onLoading();
}

function createStore<TData extends IMap, TStoreType extends ConstructorOfStore<TData>>(data: TData, initialData: TData, storeType: TStoreType) {
  return () => {
    const newData = Object.merge({}, data, initialData);
    if (!storeType) { storeType = Store as TStoreType; }
    return new storeType(newData);
  };
}

function loadStore<TData extends IMap, TOnLoad extends any>(store: Store<TData>, setState: Dispatch<SetStateAction<IProviderState>>,
  onLoadParameters: IProviderOnLoadProps<TOnLoad>) {
  return async () => {
    try {
      if (!store['load']) { return; }
      setState(s => ({ ...s, isLoading: true }));
      await store['load'](onLoadParameters);
      setState(s => ({ ...s, isLoading: false }));
    } catch (error) {
      setState(s => ({ ...s, error, isLoading: false }));
    }
  };
}

function tidyUpStore<TData extends IMap>(store: Store<TData>) {
  return () => store['dispose']();
}

export function createProvider<TData extends IMap, TStoreType extends ConstructorOfStore<TData>, TOnLoad extends any = undefined>(data: TData, storeType: TStoreType) {
  const typeId = Math.uniqueId();
  const Provider: FunctionComponent<ProviderProps<TData, TOnLoad>> = ({ children, initialData, onError, onLoading, ...rest }) => {
    const currentStores = useContext(StoreContext);
    const store = useMemo<Store<TData>>(createStore(data, initialData, storeType), []);
    const [{ error, isLoading }, setState] = useState<IProviderState>({ error: null, isLoading: false });

    useOnMount(loadStore(store, setState, rest as any));
    useOnUnmount(tidyUpStore(store));

    return (
      <StoreContext.Provider value={{ ...currentStores, [typeId]: store['storeId'] }}>
        {renderError(error, onError) || renderPending(isLoading, onLoading) || children || null}
      </StoreContext.Provider>
    );
  };

  Provider[StoreTypeId] = typeId;

  return Provider as IProvider<TData, InstanceType<TStoreType>, TOnLoad>;
}
