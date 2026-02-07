import type { CSSProperties } from 'react';
import { useContext, useLayoutEffect, useMemo } from 'react';
import { useOnResize } from '../../../hooks';
import { ConfiguratorColumnWidthsContext } from './ConfiguratorColumnWidthsContext';

interface Props {
  columnIndex: number;
  isSubItem?: boolean;
  isHeader?: boolean;
}

export function useConfiguratorColumnWidths({ columnIndex, isHeader = false }: Props) {
  const { itemMinWidth, itemMaxWidth, sliceMinAndMaxWidths, setColumnWidth, onColumnWidthChange } = useContext(ConfiguratorColumnWidthsContext);
  const { elementRef, width, target } = useOnResize({ isEnabled: isHeader, observeWidthOnly: true });

  useLayoutEffect(() => {
    if (!isHeader || width == null) return;
    setColumnWidth(columnIndex, width);
  }, [width, isHeader, columnIndex]);

  onColumnWidthChange(columnIndex, newWidth => {
    const element = elementRef.current;
    if (element == null || isHeader) return;
    element.style.maxWidth = element.style.minWidth = element.style.width = `${newWidth}px`;
  });

  const style = useMemo<CSSProperties>(() => ({
    maxWidth: !isHeader ? sliceMinAndMaxWidths[columnIndex - 1]?.maxWidth : itemMaxWidth,
    minWidth: !isHeader ? sliceMinAndMaxWidths[columnIndex - 1]?.minWidth : itemMinWidth,
    width: isHeader ? 'auto' : 0,
  }), [itemMinWidth, itemMaxWidth, sliceMinAndMaxWidths[columnIndex - 1], columnIndex, isHeader]);

  return {
    elementRef,
    style,
    target,
  };
}
