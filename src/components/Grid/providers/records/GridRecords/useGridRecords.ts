import { Record } from '@anupheaus/common';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { useBound, useOnUnmount } from '../../../../../hooks';
import { GridRecordsContext } from './GridRecordsContext';

export function useGridRecords() {
  const { records } = useContext(GridRecordsContext);
  const updateOnModifiedRef = useRef(false);
  const [rawRecords, setRawRecords] = useState<Record[]>([]);
  const isUnmounted = useOnUnmount();

  const handleRecordsModified = useBound(() => {
    if (records.length !== rawRecords.length) setRawRecords(records.toArray());
    return records.onModified(() => {
      if (isUnmounted()) return;
      if (updateOnModifiedRef.current) setRawRecords(records.toArray());
    });
  });

  useLayoutEffect(handleRecordsModified, []);

  return {
    upsert: records.upsert,
    remove: records.remove,
    get records() { updateOnModifiedRef.current = true; return rawRecords; },
  };
}