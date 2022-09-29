import { Dispatch, SetStateAction, useState } from 'react';
import { useBatchUpdates } from '../useBatchUpdates';
import { useBound } from '../useBound';

interface Props<T> {
  type?: 'local' | 'session' | 'both';
  defaultValue?(): T;
}

function getFromStorage<T>(key: string, defaultValue: Props<T>['defaultValue'] | undefined, storage: Storage): T {
  if (!(key in storage)) { return defaultValue?.() as T; }
  const value = storage.getItem(key);
  if (value == null || value.length === 0 || value === 'null') return defaultValue?.() as T;
  try {
    return JSON.parse(value) as unknown as T;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`A value found in storage with key "${key}" could not be parsed correctly, will use defaultValue if provided.`);
    return defaultValue?.() as T;
  }
}

function useStorageState<T>(key: string, storage: Storage, defaultValue?: () => T) {
  const hasKey = (key in storage);
  const [state, internalSetState] = useState(getFromStorage<T>(key, defaultValue, storage));

  const setState = useBound((param: SetStateAction<T>) =>
    internalSetState(prevState => {
      const newState = typeof (param) === 'function' ? (param as (prevState: T) => T)(prevState) : param;
      if (newState == null) {
        storage.removeItem(key);
      } else {
        const value = JSON.stringify(newState);
        storage.setItem(key, value);
      }
      return newState;
    }));

  return { hasKey, state, setState };
}

export function useStorage<T>(key: string, propsOrDefaultValue?: Props<T>['defaultValue'] | Props<T>) {
  const { defaultValue, type = 'local' } = typeof (propsOrDefaultValue) === 'function' ? { defaultValue: propsOrDefaultValue } : propsOrDefaultValue ?? {};
  const firstStorage = type === 'local' ? window.localStorage : window.sessionStorage;
  const secondStorage = type === 'both' ? window.localStorage : undefined;
  const batchUpdates = useBatchUpdates();

  let state: T | undefined;
  let setState: Dispatch<SetStateAction<T>> | undefined;
  let firstSetState: Dispatch<SetStateAction<T>> | undefined;
  let hasState = false;

  if (!firstStorage && !secondStorage) throw new Error('No browser storage available.');

  if (firstStorage) {
    const { hasKey, state: innerState, setState: innerSetState } = useStorageState(key, firstStorage, defaultValue);
    state = innerState;
    firstSetState = setState = innerSetState;
    if (hasKey) hasState = true;
  }

  if (secondStorage) {
    const { state: innerState, setState: innerSetState } = useStorageState(key, secondStorage, defaultValue);
    setState = useBound((param: SetStateAction<T>) => {
      batchUpdates(() => {
        firstSetState?.(param);
        innerSetState(param);
      });
    });
    if (!hasState) state = innerState;
  }

  return {
    state: state!,
    get isInSessionStorage() { return key in window.sessionStorage; },
    get isInLocalStorage() { return key in window.localStorage; },
    setState: setState!,
  };
}