import { IMap, DeepPartial } from 'anux-common';
import { IStore, StoreCallback } from './models';

export function createStore<TData extends IMap, TActions extends IMap>(initialStore: TData, actions: (upsert: (data: DeepPartial<TData>) => void) => TActions)
  : IStore<TData, TActions> {

  let localData: TData = initialStore;
  let callbacks: StoreCallback[] = [];
  let callbacksToCall: StoreCallback[] = [];
  let currentCallback: StoreCallback = null;
  let callbackCallingId: string = null;

  const callAllCallbacks = () => {
    const localCallingId = callbackCallingId = Math.uniqueId();
    callbacksToCall.forEach(callback => {
      if (localCallingId !== callbackCallingId) { return; } // check that we are still the right instance of callAllCallbacks
      if (!callbacks.includes(callback)) { return; } // check that the callback hasn't been removed
      currentCallback = callback;
      callback(localData);
    });
    callbackCallingId = null;
  };

  const actionsData = actions(updatedData => {
    const newLocalData = Object.merge({}, localData, updatedData);
    if (Reflect.areDeepEqual(newLocalData, localData)) { return; } // don't call any callbacks, no changes have been made
    localData = newLocalData;
    callbacksToCall = callbackCallingId == null ? callbacks.clone() : callbacks.remove(currentCallback); // remove this current callback to prevent recursion
    callAllCallbacks();
  });

  const store: IStore<TData, TActions> = {
    data: localData,
    actions: actionsData,
  };

  return {
    ...store,
    registerCallback(callback: StoreCallback<TData>): () => void {
      callbacks.push(callback);
      return () => { callbacks = callbacks.remove(callback); };
    },
  } as any;
}
