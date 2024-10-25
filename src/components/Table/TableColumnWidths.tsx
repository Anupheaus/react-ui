import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { useBound, useCallbacks } from '../../hooks';

interface ContextProps {
  setColumnWidth(index: number, width: number): void;
  onColumnWidthChange(index: number, delegate: (width: number) => void): void;
}

const Context = createContext<ContextProps>({ setColumnWidth: () => void 0, onColumnWidthChange: () => void 0 });

interface Props {
  children: ReactNode;
}

export const TableColumnWidthProvider = createComponent('TableColumnWidthProvider', ({
  children,
}: Props) => {
  const columnWidths = useRef(new Map<number, number>()).current;
  const { invoke, registerOutOfRenderPhaseOnly } = useCallbacks<(index: number) => void>();

  const setColumnWidth = useBound((index: number, width: number) => {
    columnWidths.set(index, width);
    invoke(index);
  });

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
  }), []);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
});

export function useSetTableColumnWidth(index: number) {
  const { setColumnWidth } = useContext(Context);
  return useBound((newWidth: number) => setColumnWidth(index, newWidth));
}

export function useGetTableColumnWidth(index: number) {
  const [width, setLocalWidth] = useState<number>();
  const { onColumnWidthChange } = useContext(Context);
  onColumnWidthChange(index, setLocalWidth);
  return width;
}