import { Record, Upsertable } from 'anux-common';
import { createContext } from 'react';

export interface RecordsProviderContextEntry<T extends Record = Record> {
  records: Map<string, T>;
  onChanged(delegate: (record: T, action: 'MODIFIED' | 'DELETED' | 'REMOVED') => void): void;
  upsert(record: Upsertable<T>): void;
  get(id: string): T | undefined;
  get(): T[];
}

export type RecordsProviderContextProps<T extends Record = Record> = Map<string, RecordsProviderContextEntry<T>>;

export function createRecordsProviderContextEntry<T extends Record = Record>(): RecordsProviderContextEntry<T> {
  return {
    records: new Map(),
    onChanged: () => void 0,
    upsert: () => void 0,
    get: () => void 0 as any,
  };
}

export const RecordsProviderContext = createContext<RecordsProviderContextProps>(new Map());
