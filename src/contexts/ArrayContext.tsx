import { Record } from '@anupheaus/common';
import { createContext, ReactNode } from 'react';
import { createComponent } from '../components';

interface ArrayContextProps<T extends Record> {
  isValidContext: boolean;
  registerCallback(callback: (array: T[]) => void): () => void;
  updateArray(delegate: (array: T[]) => T[]): void;
}

interface ProviderProps<T> {
  array?: T[];
  children: ReactNode;
}

export function createArrayContext<T extends Record>() {
  const arrayContext = createContext<ArrayContextProps<T>>({
    isValidContext: false,
    registerCallback: () => () => void 0,
    updateArray: () => void 0,
  });

  const Provider = createComponent({
    id: 'ArrayContextProvider',

    render({
      children,
    }: ProviderProps<T>) {

    },
  });

  return {
    Provider,
  };
}