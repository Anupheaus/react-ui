import { DataPagination } from '@anupheaus/common';
import { ReactNode } from 'react';

export type AddChildren<TProps extends {}> = TProps extends { children: unknown; } ? TProps : TProps & { children?: ReactNode; };

export interface UseDataRequest {
  requestId: string;
  pagination: DataPagination;
}

export interface UseDataResponse<T> {
  requestId: string;
  items: T[];
  total: number;
}
