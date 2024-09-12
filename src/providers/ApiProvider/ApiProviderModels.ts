import type { AnyObject } from '@anupheaus/common';
import { ListItems } from '@anupheaus/common';
import type { ReactListItem } from '../../models';

export interface Api {
  get<T>(url: string): Promise<T>;
  post<T, D extends AnyObject = AnyObject>(url: string, data?: D): Promise<T>;
  remove(url: string): Promise<void>;
  query<T extends {}>(url: string, request: ApiRequest<T>): Promise<ApiResponse<T>>;
  addToHeaders(key: string, value: string): void;
  removeFromHeaders(key: string): void;
  getHeaders(): Record<string, string>;
  setAuthToken(token: string | undefined): void;
}

interface ApiFilterOperatorListItem extends ReactListItem {
  operatorSymbol: string;
  valueModification(value: unknown): unknown;
}

const { ids: filterOperatorIds, pairs: ApiFilterOperatorPairs } = ListItems.as<ApiFilterOperatorListItem>().create([
  { id: 'equals', text: 'is equal to', operatorSymbol: '=', valueModification: v => v },
  { id: 'notEquals', text: 'is not equal to', operatorSymbol: '!=', valueModification: v => v },
  { id: 'greaterThan', text: 'is greater than', operatorSymbol: '>', valueModification: v => v },
  { id: 'lessThan', text: 'is less than', operatorSymbol: '<', valueModification: v => v },
  { id: 'greaterThanOrEqualTo', text: 'is greater than or equal to', operatorSymbol: '>=', valueModification: v => v },
  { id: 'lessThanOrEqualTo', text: 'is less than or equal to', operatorSymbol: '<=', valueModification: v => v },
  { id: 'contains', text: 'contains', operatorSymbol: 'LIKE', valueModification: v => `%${v}%` },
] as const);

const ApiFilterOperators = ApiFilterOperatorPairs as (typeof ApiFilterOperatorPairs & {
  getSymbolFor(operator: ApiFilterOperator): string | undefined;
  applyValueModificationUsing(operator: ApiFilterOperator, value: unknown): unknown;
});
ApiFilterOperators.getSymbolFor = operator => ApiFilterOperators.find(item => item.id === operator)?.operatorSymbol;
ApiFilterOperators.applyValueModificationUsing = (operator, value) => ApiFilterOperators.find(item => item.id === operator)?.valueModification(value) ?? value;

export type ApiFilterOperator = typeof filterOperatorIds;
export { ApiFilterOperators };

export interface ApiFilterFull<T extends {} = {}, K extends keyof T = keyof T> {
  field: K;
  operator: ApiFilterOperator;
  value: T[K];
}

export type ApiFilter<T extends {} = {}> = {
  [K in keyof T]?: T[K] | { operator: ApiFilterOperator; value: T[K]; };
} | ApiFilterFull<T, keyof T>;

export type ApiFilterGroupCondition = 'AND' | 'OR';

export interface ApiFilterGroup<T extends {} = {}> {
  condition?: ApiFilterGroupCondition;
  subFilters?: ApiFilters<T>[];
  filters?: ApiFilter<T>[];
}

export type ApiFilters<T extends {}> = ApiFilter<T> | ApiFilter<T>[] | ApiFilterGroup<T>;

export type ApiSorts<T> = [keyof T, 'ASC' | 'DESC'][];

export interface ApiPagination {
  offset?: number;
  limit: number;
}

export interface ApiRequest<T extends {} = {}> {
  filters?: ApiFilters<T>;
  sorts?: ApiSorts<T>;
  pagination?: ApiPagination;
}

export interface ApiResponse<T extends {} = {}> {
  records: T[];
  totalRecordCount: number;
}