import type { ReactNode } from 'react';
import type { TableCellValue } from './TableCellValue';
import type { DataFilterValueTypes, Record } from '@anupheaus/common';
import type { ListOnRequest } from '../List';
import type { UseDataResponse } from '../../extensions';

export interface TableColumnCommonProps {
  id: string;
  field: string;
  type?: DataFilterValueTypes;
  label: ReactNode;
  alignment?: 'left' | 'center' | 'right';
  width?: string | number;
  isVisible?: boolean;
  className?: string;
}

export interface TableRenderValueProps<T extends Record = Record> extends TableColumnCommonProps {
  columnIndex: number;
  rowIndex: number;
  record: T | undefined;
  CellValue: typeof TableCellValue;
}

export interface TableColumn<T extends Record = Record> extends TableColumnCommonProps {
  renderValue?(props: TableRenderValueProps<T>): ReactNode;
}

type ChangeItemsToRecords<Func extends (response: UseDataResponse<any>) => void> = Func extends (response: UseDataResponse<infer T>) => void
  ? (response: Omit<UseDataResponse<T>, 'items'> & { records: T[]; }) => void : never;

export type TableOnRequest<T extends Record | string = Record> = (request: Parameters<ListOnRequest<T>>[0], response: ChangeItemsToRecords<Parameters<ListOnRequest<T>>[1]>) => Promise<void>;

export type TableUseRecordHook<T extends Record> = (id: string | undefined) => { record: T | undefined; isLoading: boolean; error?: Error; };
