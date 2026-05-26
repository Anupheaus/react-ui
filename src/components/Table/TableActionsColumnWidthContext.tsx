import type { ReactNode } from 'react';
import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';

interface ContextProps {
  columnWidth: number | undefined;
  reportWidth(width: number): void;
}

const Context = createContext<ContextProps>({
  columnWidth: undefined,
  reportWidth: () => void 0,
});

const normalizeWidth = (width: number | undefined) =>
  width == null ? undefined : Math.ceil(width);

interface ProviderProps {
  children: ReactNode;
  initialWidth?: number;
}

const TableActionsColumnWidthProviderInner = createComponent('TableActionsColumnWidthProviderInner', ({
  children,
  initialWidth,
}: ProviderProps) => {
  const [columnWidth, setColumnWidth] = useState(() => normalizeWidth(initialWidth));

  useLayoutEffect(() => {
    if (initialWidth == null) return;
    const normalizedWidth = normalizeWidth(initialWidth);
    setColumnWidth(prev => {
      if (prev != null && normalizedWidth != null && normalizedWidth <= prev) return prev;
      return normalizedWidth;
    });
  }, [initialWidth]);

  const reportWidth = useBound((width: number) => {
    const normalizedWidth = Math.ceil(width);
    if (normalizedWidth <= 0) return;
    setColumnWidth(prev => {
      if (prev != null && normalizedWidth <= prev) return prev;
      return normalizedWidth;
    });
  });

  const context = useMemo<ContextProps>(() => ({
    columnWidth,
    reportWidth,
  }), [columnWidth, reportWidth]);

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
}

export const TableActionsColumnWidthProvider = createComponent('TableActionsColumnWidthProvider', ({
  children,
  columnIndex,
  initialWidth,
}: Props) => {
  if (columnIndex < 0) return <>{children}</>;

  return (
    <TableActionsColumnWidthProviderInner initialWidth={initialWidth}>
      {children}
    </TableActionsColumnWidthProviderInner>
  );
});

export function useReportTableActionsColumnWidth() {
  const { reportWidth } = useContext(Context);
  return reportWidth;
}

export function useTableActionsColumnWidth() {
  return useContext(Context).columnWidth;
}
