import { ReactNode } from 'react';

export interface GridRenderValueAdditionalProps<T = unknown> {
  columnIndex: number;
  rowIndex: number;
  record: T;
}

export interface GridColumnType<T = unknown> {
  id: string;
  label: ReactNode;
  alignment?: 'left' | 'center' | 'right';
  width?: string | number;
  renderValue?(props: this & GridRenderValueAdditionalProps<T>): ReactNode;
}
