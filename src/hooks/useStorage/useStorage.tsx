import { Dispatch, SetStateAction, useState } from 'react';
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`A value found in storage with key "${key}" could not be parsed correctly, will use defaultValue if provided.`);
    return defaultValue?.() as T;
  }
}

function useStorageState<T>(key: string, storage: Storage, defaultValue?: () => T, disabled?: boolean) {
  const hasKey = disabled ? false : (key in storage);
  const [state, internalSetState] = useState<T | undefined>(() =>
    disabled ? undefined : getFromStorage<T>(key, defaultValue, storage),
  );

  const setState = useBound((param: SetStateAction<T | undefined>) => {
    if (disabled) return;
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
  const firstStorage = type === 'local' ? window.localStorage : window.sessionStorage;
  const secondStorage = type === 'both' ? window.localStorage : undefined;
  const batchUpdates = useBatchUpdates();

  let state: T | undefined;
  let setState: Dispatch<SetStateAction<T | undefined>> | undefined;
  let firstSetState: Dispatch<SetStateAction<T | undefined>> | undefined;
  let hasState = false;

  if (!firstStorage && !secondStorage) throw new Error('No browser storage available.');

  if (firstStorage) {
    const { hasKey, state: innerState, setState: innerSetState } = useStorageState(key, firstStorage, defaultValue, disabled);
    state = innerState;
    firstSetState = setState = innerSetState;
    if (hasKey) hasState = true;
  }

  if (secondStorage) {
    const { state: innerState, setState: innerSetState } = useStorageState(key, secondStorage, defaultValue, disabled);
    setState = useBound((param: SetStateAction<T | undefined>) => {
      if (disabled) return;
      batchUpdates(() => {
        firstSetState?.(param);
        innerSetState(param);
      });
    });
    if (!hasState) state = innerState;
  }

  return {
    state: state,
    get isInSessionStorage() { return !disabled && key in window.sessionStorage; },
    get isInLocalStorage() { return !disabled && key in window.localStorage; },
    setState: setState!,
  };
}