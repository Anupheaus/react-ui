import type { Record } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useContext, useRef } from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import type { RecordsProviderContextProps } from './RecordsProviderContext';
import { createRecordsProviderContextEntry, RecordsProviderContext } from './RecordsProviderContext';

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

export function useRecordsProvider<T extends Record = Record>(typeId: string): ReturnType<typeof useEmptyRecordsProvider<T>>;
export function useRecordsProvider<T extends Record = Record>(typeId: string, id: string): ReturnType<typeof useIdWithRecordsProvider<T>>;
export function useRecordsProvider<T extends Record = Record>(...args: unknown[]) {
  const typeId = args[0] as string | undefined;
  if (is.empty(typeId)) throw new Error('The typeId for the records provider is required.');
  // Both are always called so the hook order never depends on the arity; the unused one stays inert
  // (its change handler only re-renders for an observed records list or a matching id, neither of which happens).
  const emptyProvider = useEmptyRecordsProvider<T>(typeId);
  const idProvider = useIdWithRecordsProvider<T>(typeId, args[1] as string | undefined);
  return args.length === 1 ? emptyProvider : idProvider;
}