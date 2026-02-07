import { createContext } from 'react';

interface SliceMinAndMaxWidths {
  index: number;
  minWidth: number | undefined;
  maxWidth: number | undefined;
}

export interface ConfiguratorColumnWidthsContextProps {
  itemMinWidth?: number;
  itemMaxWidth?: number;
  sliceMinAndMaxWidths: SliceMinAndMaxWidths[];
  setColumnWidth(index: number, width: number): void;
  onColumnWidthChange(index: number, delegate: (width: number) => void): void;
}

export const ConfiguratorColumnWidthsContext = createContext<ConfiguratorColumnWidthsContextProps>({
  sliceMinAndMaxWidths: [],
  setColumnWidth: () => void 0,
  onColumnWidthChange: () => void 0,
});
