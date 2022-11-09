import { createContext as reactCreateContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DistributedState<T> {

}

export namespace DistributedState {
  export function createContext<T>() {
    return reactCreateContext<DistributedState<T> | undefined>(undefined);
  }
}

export interface DistributedStateApi<T> {
  state: DistributedState<T>;
  get(): T;
  getAndObserve(): T;
  observe(): void;
  set(value: T): void;
  modify(modifier: (value: T) => T): void;
  onChange(handler: (value: T) => void): void;
}
