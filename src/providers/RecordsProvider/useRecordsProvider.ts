import { is, Record } from 'anux-common';
import { useContext, useRef } from 'react';
import { useForceUpdate } from '../../hooks';
import { createRecordsProviderContextEntry, RecordsProviderContext, RecordsProviderContextProps } from './RecordsProviderContext';

function useEmptyRecordsProvider<T extends Record = Record>(typeId: string) {
  const recordsMap = useContext(RecordsProviderContext) as RecordsProviderContextProps<T>;
  const { records: mappedRecords, onChanged, upsert, get } = recordsMap.getOrSet(typeId, () => createRecordsProviderContextEntry());
  const observeRef = useRef(false);
  const update = useForceUpdate();

  onChanged(() => {
    if (!observeRef.current) return;
    update();
  });

  return {
    get records() { observeRef.current = true; return mappedRecords; },
    onChanged,
    upsert,
    get,
  };
}

function useIdWithRecordsProvider<T extends Record = Record>(typeId: string, id: string | undefined) {
  const recordsMap = useContext(RecordsProviderContext) as RecordsProviderContextProps<T>;
  const { onChanged, upsert, get } = recordsMap.getOrSet(typeId, () => createRecordsProviderContextEntry());
  const update = useForceUpdate();

  onChanged(record => record.id === id ? update() : null);

  return {
    get record() { return id != null ? get(id) : undefined; },
    onChanged,
    upsert,
  };
}

class UseRecordsProvider<T extends Record> { public getEmpty() { return useEmptyRecordsProvider<T>(''); } public getWithId() { return useIdWithRecordsProvider<T>('', ''); } }

export function useRecordsProvider<T extends Record = Record>(typeId: string): ReturnType<UseRecordsProvider<T>['getEmpty']>;
export function useRecordsProvider<T extends Record = Record>(typeId: string, id: string): ReturnType<UseRecordsProvider<T>['getWithId']>;
export function useRecordsProvider<T extends Record = Record>(...args: unknown[]) {
  const typeId = args[0] as string | undefined;
  if (is.empty(typeId)) throw new Error('The typeId for the records provider is required.');
  return args.length === 1 ? useEmptyRecordsProvider<T>(typeId) : useIdWithRecordsProvider<T>(typeId, args[1] as string | undefined);
}