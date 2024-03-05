import { DataPagination, PromiseMaybe } from '@anupheaus/common';
import { ReactNode } from 'react';

export type AddChildren<TProps extends {}> = TProps extends { children: unknown; } ? TProps : TProps & { children?: ReactNode; };

export interface UseDataRequest {
  onUpdated(): void;
}

export type UseDataResponse<T> = PromiseMaybe<Partial<DataPagination> & { items: T[]; total: number; }>;
