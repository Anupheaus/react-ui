import type { ReactNode } from 'react';
import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';

interface ContextProps {
  columnWidth: number | undefined;
  reportWidth(key: string, width: number): void;
  clearWidth(key: string): void;
}

const Context = createContext<ContextProps>({
  columnWidth: undefined,
  reportWidth: () => void 0,
  clearWidth: () => void 0,
});

const normalizeWidth = (width: number | undefined) =>
  width == null ? undefined : Math.ceil(width);

function resolveColumnWidth(reportedWidths: number[], initialWidth: number | undefined) {
  const maxReported = reportedWidths.length > 0 ? Math.max(...reportedWidths) : undefined;
  const fallback = normalizeWidth(initialWidth);
  const next = maxReported ?? fallback;
  return next != null && next > 0 ? next : undefined;
}

interface ProviderProps {
  children: ReactNode;
  initialWidth?: number;
  lockWidth?: boolean;
}

const TableActionsColumnWidthProviderInner = createComponent('TableActionsColumnWidthProviderInner', ({
  children,
  initialWidth,
  lockWidth = false,
}: ProviderProps) => {
  const [columnWidth, setColumnWidth] = useState(() => normalizeWidth(initialWidth));
  const widthLockedRef = useRef(lockWidth);
  const initialWidthRef = useRef(initialWidth);
  const reportedWidthsRef = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    widthLockedRef.current = lockWidth;
  }, [lockWidth]);

  useLayoutEffect(() => {
    initialWidthRef.current = initialWidth;
  }, [initialWidth]);

  const recalculate = useBound(() => {
    if (widthLockedRef.current) return;
    setColumnWidth(resolveColumnWidth(
      Array.from(reportedWidthsRef.current.values()),
      initialWidthRef.current,
    ));
  });

  useLayoutEffect(() => {
    if (initialWidth == null) return;
    recalculate();
  }, [initialWidth, recalculate]);

  const reportWidth = useBound((key: string, width: number) => {
    const normalizedWidth = Math.ceil(width);
    if (normalizedWidth <= 0 || widthLockedRef.current) return;
    reportedWidthsRef.current.set(key, normalizedWidth);
    recalculate();
  });

  const clearWidth = useBound((key: string) => {
    if (widthLockedRef.current) return;
    reportedWidthsRef.current.delete(key);
    recalculate();
  });

  const context = useMemo<ContextProps>(() => ({
    columnWidth,
    reportWidth,
    clearWidth,
  }), [columnWidth, reportWidth, clearWidth]);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
});

interface Props {
  children: ReactNode;
  columnIndex: number;
  initialWidth?: number;
  lockWidth?: boolean;
}

export const TableActionsColumnWidthProvider = createComponent('TableActionsColumnWidthProvider', ({
  children,
  columnIndex,
  initialWidth,
  lockWidth,
}: Props) => {
  if (columnIndex < 0) return <>{children}</>;

  return (
    <TableActionsColumnWidthProviderInner initialWidth={initialWidth} lockWidth={lockWidth}>
      {children}
    </TableActionsColumnWidthProviderInner>
  );
});

export function useReportTableActionsColumnWidth() {
  return useContext(Context);
}

export function useTableActionsColumnWidth() {
  return useContext(Context).columnWidth;
}
