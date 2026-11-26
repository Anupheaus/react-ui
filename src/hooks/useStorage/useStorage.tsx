import type { Dispatch, SetStateAction} from 'react';
import { useState } from 'react';
import { useBatchUpdates } from '../useBatchUpdates';
import { useBound } from '../useBound';

interface Props<T> {
  type?: 'local' | 'session' | 'both';
  defaultValue?(): T;
  disabled?: boolean;
}

function getFromStorage<T>(key: string, defaultValue: Props<T>['defaultValue'] | undefined, storage: Storage): T | undefined {
  if (!(key in storage)) { return defaultValue?.(); }
  const value = storage.getItem(key);
  if (value == null || value.length === 0 || value === 'null') return defaultValue?.();
  try {
    return JSON.parse(value) as unknown as T;
  } catch {
     
    console.warn(`A value found in storage with key "${key}" could not be parsed correctly, will use defaultValue if provided.`);
    return defaultValue?.() as T;
  }
}

function getStorages(type: Props<unknown>['type']) {
  const firstStorage: Storage | undefined = type === 'local' ? window.localStorage : window.sessionStorage;
  const secondStorage: Storage | undefined = type === 'both' ? window.localStorage : undefined;
  if (!firstStorage && !secondStorage) throw new Error('No browser storage available.');
  return { firstStorage, secondStorage };
}

/** A missing storage behaves as disabled, so this hook can be called unconditionally for every storage slot. */
function useStorageState<T>(key: string, storage: Storage | undefined, defaultValue?: () => T, isDisabled?: boolean) {
  const hasKey = isDisabled || storage == null ? false : (key in storage);
  const [state, internalSetState] = useState<T | undefined>(() =>
    isDisabled || storage == null ? undefined : getFromStorage<T>(key, defaultValue, storage),
  );

  const setState = useBound((param: SetStateAction<T | undefined>) => {
    if (isDisabled || storage == null) return;
    internalSetState(prevState => {
      const newState = typeof (param) === 'function' ? (param as (prevState: T | undefined) => T | undefined)(prevState) : param;
      if (newState == null) {
        storage.removeItem(key);
      } else {
        const value = JSON.stringify(newState);
        storage.setItem(key, value);
      }
      return newState;
    });
  });

  return { hasKey, state, setState };
}

export function useStorage<T>(key: string, propsOrDefaultValue?: Props<T>['defaultValue'] | Props<T>) {
  const { defaultValue, type = 'local', disabled = false } = typeof (propsOrDefaultValue) === 'function'
    ? { defaultValue: propsOrDefaultValue } : propsOrDefaultValue ?? {};
  const { firstStorage, secondStorage } = getStorages(type);
  const batchUpdates = useBatchUpdates();

  // Both slots are always called so the hook order cannot change if `type` changes between renders; an absent storage is a no-op slot.
  const { hasKey: firstHasKey, state: firstState, setState: firstSetState } = useStorageState(key, firstStorage, defaultValue, disabled);
  const { state: secondState, setState: secondSetState } = useStorageState(key, secondStorage, defaultValue, disabled);
  const setBothStates = useBound((param: SetStateAction<T | undefined>) => {
    if (disabled) return;
    batchUpdates(() => {
      if (firstStorage != null) firstSetState(param);
      secondSetState(param);
    });
  });

  const state = secondStorage == null || firstHasKey ? firstState : secondState;
  const setState: Dispatch<SetStateAction<T | undefined>> = secondStorage == null ? firstSetState : setBothStates;

  return {
    state: state,
    get isInSessionStorage() { return !disabled && key in window.sessionStorage; },
    get isInLocalStorage() { return !disabled && key in window.localStorage; },
    setState,
  };
}