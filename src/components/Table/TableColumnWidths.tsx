import type { ReactNode } from 'react';
import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { useBound, useCallbacks } from '../../hooks';

interface SetColumnWidthOptions {
  manual?: boolean;
}

interface ContextProps {
  setColumnWidth(index: number, width: number, options?: SetColumnWidthOptions): void;
  onColumnWidthChange(index: number, delegate: (width: number) => void): void;
  isManualWidth(index: number): boolean;
}

const Context = createContext<ContextProps>({
  setColumnWidth: () => void 0,
  onColumnWidthChange: () => void 0,
  isManualWidth: () => false,
});

interface Props {
  children: ReactNode;
  initialWidths?: Map<number, number>;
}

export const TableColumnWidthProvider = createComponent('TableColumnWidthProvider', ({
  children,
  initialWidths,
}: Props) => {
  const columnWidths = useRef(new Map<number, number>()).current;
  const manualIndices = useRef(new Set<number>()).current;
  const hasAppliedInitialWidths = useRef(false);
  const { invoke, registerOutOfRenderPhaseOnly } = useCallbacks<(index: number) => void>();

  useLayoutEffect(() => {
    if (hasAppliedInitialWidths.current || initialWidths == null) return;
    hasAppliedInitialWidths.current = true;
    initialWidths.forEach((width, index) => {
      columnWidths.set(index, width);
      manualIndices.add(index);
      invoke(index);
    });
  }, [initialWidths]);

  const setColumnWidth = useBound((index: number, width: number, options?: SetColumnWidthOptions) => {
    columnWidths.set(index, width);
    if (options?.manual === true) {
      manualIndices.add(index);
    }
    invoke(index);
  });

  const isManualWidth = useBound((index: number) => manualIndices.has(index));

  const onColumnWidthChange = useBound((index: number, delegate: (width: number) => void) => {
    const lastWidthRef = useRef<number>();
    const handler = (updatedIndex: number) => {
      if (updatedIndex !== index) return;
      const result = columnWidths.get(index);
      if (lastWidthRef.current === result) return;
      lastWidthRef.current = result;
      if (result == null) return;
      delegate(result);
    };
    registerOutOfRenderPhaseOnly(handler);
    handler(index);
  });

  const context = useMemo<ContextProps>(() => ({
    setColumnWidth,
    onColumnWidthChange,
    isManualWidth,
  }), []);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
});

export function useSetTableColumnWidth(index: number) {
  const { setColumnWidth } = useContext(Context);
  return useBound((newWidth: number, options?: SetColumnWidthOptions) => setColumnWidth(index, newWidth, options));
}

export function useGetTableColumnWidth(index: number) {
  const [width, setLocalWidth] = useState<number>();
  const { onColumnWidthChange } = useContext(Context);
  onColumnWidthChange(index, setLocalWidth);
  return width;
}

export function useIsManualTableColumnWidth(index: number) {
  const { isManualWidth } = useContext(Context);
  return isManualWidth(index);
}
