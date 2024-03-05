import { ReactNode } from 'react';
import { GridCellValue } from './GridCellValue';
import { DataFilterValueTypes, Record } from '@anupheaus/common';

export interface GridColumnCommonProps {
  id: string;
  field: string;
  type?: DataFilterValueTypes;
  label: ReactNode;
  alignment?: 'left' | 'center' | 'right';
  width?: string | number;
  isVisible?: boolean;
  className?: string;
}

export interface GridRenderValueProps<T extends Record = Record> extends GridColumnCommonProps {
  columnIndex: number;
  rowIndex: number;
  record: T | undefined;
  CellValue: typeof GridCellValue;
}

export interface GridColumn<T extends Record = Record> extends GridColumnCommonProps {
  renderValue?(props: GridRenderValueProps<T>): ReactNode;
}
