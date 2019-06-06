import { useState } from 'react';
import { IStore, IInternalStore } from './models';
import { IMap } from 'anux-common';
import { useOnUnmount } from '../useOnUnmount';

export function useStore<TData extends IMap, TActions extends IMap>(store: IStore<TData, TActions>): [TData, TActions];
export function useStore<TData extends IMap, TActions extends IMap, TSelection extends IMap>(store: IStore<TData, TActions>,
  selector: (data: TData) => TSelection): [TSelection, TActions];
export function useStore<TData extends IMap, TActions extends IMap, TSelection extends IMap>(store: IStore<TData, TActions>,
  selector: (data: TData) => TSelection, onChange: (data: TSelection) => void): [TSelection, TActions];
export function useStore<TData extends IMap, TActions extends IMap, TSelection extends IMap = TData>(store: IStore<TData, TActions>,
  selector?: (data: TData) => TSelection, onChange?: (data: TSelection) => void): [TSelection, TActions] {
  selector = selector || (data => data as any);
  const [selection, updateSelection] = useState<TSelection>(selector(store.data));
  const internalStore = store as IInternalStore<TData, TActions>;

  const unregisterCallback = internalStore.registerCallback((data: TData) => {
    const newSelection = selector(data);
    if (Reflect.areDeepEqual(newSelection, selection)) { return; }
    updateSelection(newSelection);
    if (onChange) { onChange(newSelection); }
  });

  useOnUnmount(() => {
    unregisterCallback();
  });

  return [selection, store.actions];
}
