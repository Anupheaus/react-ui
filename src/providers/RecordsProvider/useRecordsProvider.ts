import type { Record } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useContext, useRef } from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import type { RecordsProviderContextEntry, RecordsProviderContextProps } from './RecordsProviderContext';
import { createRecordsProviderContextEntry, RecordsProviderContext } from './RecordsProviderContext';

export interface UseEmptyRecordsProvider<T extends Record> extends Pick<RecordsProviderContextEntry<T>, 'onChanged' | 'upsert' | 'get'> {
  readonly records: Map<string, T>;
}

export interface UseIdRecordsProvider<T extends Record> extends Pick<RecordsProviderContextEntry<T>, 'onChanged' | 'upsert'> {
  readonly record: T | undefined;
}

function useEmptyRecordsProvider<T extends Record = Record>(typeId: string): UseEmptyRecordsProvider<T> {
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

function useIdWithRecordsProvider<T extends Record = Record>(typeId: string, id: string | undefined): UseIdRecordsProvider<T> {
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

export function useRecordsProvider<T extends Record = Record>(typeId: string): UseEmptyRecordsProvider<T>;
export function useRecordsProvider<T extends Record = Record>(typeId: string, id: string): UseIdRecordsProvider<T>;
export function useRecordsProvider<T extends Record = Record>(...args: unknown[]) {
  const typeId = args[0] as string | undefined;
  if (is.empty(typeId)) throw new Error('The typeId for the records provider is required.');
  // eslint-disable-next-line react-hooks/rules-of-hooks -- each call site consistently uses one overload (with or without id), so hook order is stable per usage
  return args.length === 1 ? useEmptyRecordsProvider<T>(typeId) : useIdWithRecordsProvider<T>(typeId, args[1] as string | undefined);
}