import type { ReactNode } from 'react';
import { useId, useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../../Component';
import { useBound } from '../../../hooks';
import type { ConfiguratorSlice } from '../configurator-models';
import { ConfiguratorColumnWidthsContext, type ConfiguratorColumnWidthsContextProps } from './ConfiguratorColumnWidthsContext';

interface Props {
  itemMinWidth?: number;
  itemMaxWidth?: number;
  slices: ConfiguratorSlice[];
  children: ReactNode;
}

export const ConfiguratorColumnWidthsProvider = createComponent('ConfiguratorColumnWidthsProvider', ({
  itemMinWidth,
  itemMaxWidth,
  slices,
  children,
}: Props) => {
  const columnWidthsRef = useRef<number[]>([]);
  const delegates = useRef<Map<number, Map<string, ((width: number) => void)>>>(new Map());

  const setColumnWidth = useBound((index: number, width: number) => {
    if (columnWidthsRef.current[index] === width) return;
    columnWidthsRef.current[index] = width;
    const delegatesForIndex = delegates.current.get(index);
    if (delegatesForIndex == null || delegatesForIndex.size === 0) return;
    delegatesForIndex.forEach(delegate => delegate(width));
  });

  const onColumnWidthChange = useBound((index: number, delegate: (width: number) => void) => {
    const id = useId();
    const boundDelegate = useBound(delegate);
    const delegatesForIndex = delegates.current.getOrSet(index, () => new Map());
    delegatesForIndex.set(id, boundDelegate);

    useLayoutEffect(() => {
      if (columnWidthsRef.current[index] != null) boundDelegate(columnWidthsRef.current[index]);
    }, [columnWidthsRef.current[index]]);
  });

  const sliceMinAndMaxWidths = useMemo<ConfiguratorColumnWidthsContextProps['sliceMinAndMaxWidths']>(() => slices.map((slice, index) => ({
    index,
    minWidth: slice.minWidth,
    maxWidth: slice.maxWidth,
  })), [slices]);

  const context = useMemo<ConfiguratorColumnWidthsContextProps>(() => ({
    itemMinWidth,
    itemMaxWidth,
    sliceMinAndMaxWidths,
    setColumnWidth,
    onColumnWidthChange,
  }), [itemMinWidth, itemMaxWidth, setColumnWidth, onColumnWidthChange]);

  return (
    <ConfiguratorColumnWidthsContext.Provider value={context}>
      {children}
    </ConfiguratorColumnWidthsContext.Provider>
  );
});
