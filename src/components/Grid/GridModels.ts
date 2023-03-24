import { ReactNode } from 'react';

export interface GridRenderValueAdditionalProps<T = unknown> {
  columnIndex: number;
  rowIndex: number;
  record: T | undefined;
}

export interface GridColumn<T = unknown> {
  id: string;
  field: string;
  label: ReactNode;
  alignment?: 'left' | 'center' | 'right';
  width?: string | number;
  isVisible?: boolean;
  renderValue?(props: this & GridRenderValueAdditionalProps<T>): ReactNode;
}

export interface GridColumnSort<T = unknown> {
  column: GridColumn<T>;
  direction: 'asc' | 'desc';
}
