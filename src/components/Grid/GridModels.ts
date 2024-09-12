import { ReactNode } from 'react';
import { GridCellValue } from './GridCellValue';
import { DataFilterValueTypes, Record } from '@anupheaus/common';
import { ListOnRequest } from '../List';
import { UseDataResponse } from '../../extensions';

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

type ChangeItemsToRecords<Func extends (response: UseDataResponse<any>) => void> = Func extends (response: UseDataResponse<infer T>) => void
  ? (response: Omit<UseDataResponse<T>, 'items'> & { records: T[]; }) => void : never;

export type GridOnRequest<T extends Record | string = Record> = (request: Parameters<ListOnRequest<T>>[0], response: ChangeItemsToRecords<Parameters<ListOnRequest<T>>[1]>) => Promise<void>;

export type GridUseRecordHook<T extends Record> = (id: string | undefined) => { record: T | undefined; isLoading: boolean; error?: Error; };
