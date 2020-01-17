import { useContext, useRef, useMemo } from 'react';
import { IMap } from 'anux-common';
import { useOnUnmount } from '../useOnUnmount';
import { useForceUpdate } from '../useForceUpdate';
import { StoreTypeId } from './models';
import { StoreContext } from './context';
import { stores } from './storesRegistry';
import { Store } from './store';
import { IProvider } from './provider';

const defaultSelector = (data: any) => data;

export function useStore<TData extends IMap, TActions extends IMap>(store: IProvider<TData, TActions>): [TData, TActions];
export function useStore<TData extends IMap, TActions extends IMap, TSelection extends IMap>(storeType: IProvider<TData, TActions>,
  selector: (data: TData) => TSelection): [TSelection, TActions];
export function useStore<TData extends IMap, TActions extends IMap, TSelection extends IMap = TData>(storeType: IProvider<TData, TActions>,
  selector: (data: TData) => TSelection = defaultSelector): [TSelection, TActions] {
  if (!storeType) { throw new Error('The store provided was invalid.'); }

  const storeTypeId = storeType[StoreTypeId];
  if (!storeTypeId) { throw new Error('The store type id could not be found on the store type provided.'); }

  const { [storeTypeId]: storeId } = useContext(StoreContext);
  if (!storeId) { throw new Error('The store id could not be found within the current context for this store type.'); }

  const update = useForceUpdate();
  const unregisterCallbackRef = useRef<() => void>();
  const selectionRef = useRef<TSelection>();

  useOnUnmount(() => unregisterCallbackRef.current ? unregisterCallbackRef.current() : null);

  const store = stores[storeId] as Store<TData>;
  if (!store) { throw new Error('The store could not be found within the collection of active stores; perhaps it has been disposed?'); }

  const data = store['getData']();

  if (!unregisterCallbackRef.current) {
    unregisterCallbackRef.current = store['registerOnUpdateCallback']((updatedData: TData) => {
      const newSelection = selector(updatedData);
      if (Reflect.areDeepEqual(newSelection, selectionRef.current)) { return; }
      update();
    });
  }

  return useMemo(() => {
    selectionRef.current = selector(data);

    return [selectionRef.current, store as any as TActions];

  }, [data, selector.toString()]);

}
