import { is, Record } from '@anupheaus/common';
import { ReactNode, useContext, useMemo } from 'react';
import { createComponent } from '../../components/Component/createComponent';
import { useOnChange } from '../../hooks/useOnChange';
import { useCallbacks } from '../../hooks/useCallbacks';
import { useBound } from '../../hooks/useBound';
import { createRecordsProviderContextEntry, RecordsProviderContext, RecordsProviderContextEntry, RecordsProviderContextProps } from './RecordsProviderContext';

interface Props<T> {
  typeId: string;
  records?: T[];
  inherit?: boolean;
  children?: ReactNode;
  onMatchingInherited?(providedRecord: T, inheritedRecord: T, id: string): T;
  onUnmatchingInherited?(inheritedRecord: T, id: string): T;
}

export const RecordsProvider = createComponent({
  id: 'RecordsProvider',

  render<T extends Record = Record>({
    typeId,
    records: providedRecords,
    inherit = false,
    children = null,
    onMatchingInherited,
    onUnmatchingInherited,
  }: Props<T>) {
    const inheritedRecordsMap = (useContext(RecordsProviderContext) as RecordsProviderContextProps<T>);
    const recordsMap = useMemo(() => inheritedRecordsMap.clone(), [inheritedRecordsMap]);
    const { records: inheritedRecords, onChanged: onInheritedChanged } = inheritedRecordsMap.getOrSet(typeId, () => createRecordsProviderContextEntry());
    const [invokeChanged, registerChangedCallback] = useCallbacks<Parameters<RecordsProviderContextEntry<T>['onChanged']>[0]>();

    const records = useMemo<Map<string, T>>(() => {
      return (inherit ? inheritedRecords.clone() : new Map()).merge(is.array(providedRecords) ? providedRecords : [], {
        keyExtractor: ({ id }) => id,
        mapMatchedTo: (inheritedRecord, providedRecord, key) => {
          const newRecord = onMatchingInherited?.(providedRecord, inheritedRecord, key) ?? providedRecord;
          if (is.deepEqual(newRecord, providedRecord)) { return providedRecord; }
          invokeChanged(newRecord, 'MODIFIED');
          return newRecord;
        },
        mapUnmatchedLeftTo: (inheritedRecord, key) => {
          const newRecord = onUnmatchingInherited?.(inheritedRecord, key) ?? inheritedRecord;
          if (is.deepEqual(newRecord, inheritedRecord)) { return inheritedRecord; }
          invokeChanged(newRecord, 'MODIFIED');
          return newRecord;
        },
        mapUnmatchedRightTo: providedRecord => providedRecord,
      });
    }, [inheritedRecords, providedRecords]);

    onInheritedChanged((record, reason) => {
      if (!inherit) return;
      const providedRecord = providedRecords?.findById(record.id);
      if (reason === 'MODIFIED') {
        if (providedRecord) {
          record = onMatchingInherited?.(providedRecord, record, record.id) ?? providedRecord;
          if (is.deepEqual(record, providedRecord)) return;
        }
        records.set(record.id, record);
        invokeChanged(record, 'MODIFIED');
      } else if (reason === 'DELETED') {
        if (!records.has(record.id)) return;
        records.delete(record.id);
        invokeChanged(record, 'DELETED');
      }
    });

    useOnChange(() => {
      inheritedRecords.forEach(record => {
        if (inherit) {
          const providedRecord = records.has(record.id) ? providedRecords?.findById(record.id) : undefined;
          const newRecord = providedRecord ? (onMatchingInherited?.(providedRecord, record, record.id) ?? Object.merge({}, record, providedRecord)) : (onUnmatchingInherited?.(record, record.id) ?? record);
          if (records.has(record.id) && is.deepEqual(newRecord, records.get(record.id)!)) return;
          records.set(record.id, newRecord);
          invokeChanged(newRecord, 'MODIFIED');
        } else {
          if (!records.has(record.id)) return;
          if (!is.deepEqual(records.get(record.id)!, record)) return;
          records.delete(record.id);
          invokeChanged(record, 'REMOVED');
        }
      });
    }, [inherit]);

    const onChanged = useBound<RecordsProviderContextEntry<T>['onChanged']>(delegate => registerChangedCallback((_state, newRecord, reason) => delegate(newRecord, reason)));

    const upsert = useBound<RecordsProviderContextEntry<T>['upsert']>(newRecord => {
      const record = { id: Math.uniqueId(), ...records.get(newRecord.id ?? ''), ...newRecord } as T;
      if (is.deepEqual(record, records.get(record.id))) return;
      contextEntry.records.set(record.id, record);
      invokeChanged(record, 'MODIFIED');
    });

    const get = useBound<RecordsProviderContextEntry<T>['get']>((...args: unknown[]): any => {
      if (args.length === 0) return records;
      if (!is.string(args[0])) return;
      return records.get(args[0]);
    });

    const contextEntry = useMemo<RecordsProviderContextEntry<T>>(() => ({
      records,
      onChanged,
      upsert,
      get,
    }), [records]);

    recordsMap.set(typeId, contextEntry);

    return (
      <RecordsProviderContext.Provider value={recordsMap}>
        {children}
      </RecordsProviderContext.Provider>
    );
  },

} as const);
