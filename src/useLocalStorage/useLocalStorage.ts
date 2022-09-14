import { is } from 'anux-common';
import { useBound } from '../hooks/useBound';

export function useLocalStorage<T = unknown>(key: string): [T | undefined, (value: T | null) => void];
export function useLocalStorage<T>(key: string, defaultValue: () => T): [T, (value: T | null) => void];
export function useLocalStorage<T>(key: string, defaultValue?: () => T): [T | undefined, (value: T | null) => void] {
  const set = useBound((newValue: T | null) => {
    if (newValue == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
  const hasKey = key in window.localStorage;
  let value: T | undefined = undefined;
  if (hasKey) {
    const stringOrNullValue = window.localStorage.getItem(key);
    value = stringOrNullValue == null ? undefined : JSON.parse(stringOrNullValue);
  } else {
    if (is.function(defaultValue)) value = defaultValue();
  }
  return [value, set];
}