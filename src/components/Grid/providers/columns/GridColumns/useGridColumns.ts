import { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBatchUpdates, useBound, useOnUnmount } from '../../../../../hooks';
import { GridColumn } from '../../../GridModels';
import { GridColumnsContext } from './GridColumnsContext';

export function useGridColumns() {
  const { columns } = useContext(GridColumnsContext);
  const updateOnModifiedRef = useRef(false);
  const [rawColumns, setRawColumns] = useState<GridColumn[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<GridColumn[]>([]);
  const isUnmounted = useOnUnmount();
  const batchUpdate = useBatchUpdates();
  const callbacks = useRef(new Set<(columns: GridColumn[]) => void>()).current;

  const handleColumnsModified = useBound(() => {
    const updateColumns = () => batchUpdate(() => {
      const allColumns = columns.toArray();
      setRawColumns(allColumns);
      setVisibleColumns(allColumns.filter(({ isVisible }) => isVisible !== false));
      callbacks.forEach(callback => callback(allColumns));
    });
    if (columns.length !== rawColumns.length) updateColumns();
    return columns.onModified(() => {
      if (isUnmounted() || !updateOnModifiedRef.current) return;
      updateColumns();
    });
  });

  const onChange = useBound((delegate: (columns: GridColumn[]) => void) => {
    const boundDelegate = useBound(delegate);
    useMemo(() => callbacks.add(boundDelegate), []);
    useLayoutEffect(() => () => { callbacks.delete(boundDelegate); }, []);
  });

  useLayoutEffect(handleColumnsModified, []);

  return {
    upsert: columns.upsert,
    remove: columns.remove,
    reorder: columns.reorder,
    onChange,
    get columns() { updateOnModifiedRef.current = true; return rawColumns; },
    get visibleColumns() { updateOnModifiedRef.current = true; return visibleColumns; },
  };
}