import { ListItem } from '../../models';

interface DataFilterOperatorListItem extends ListItem {
  operatorSymbol: string;
  valueModification(value: unknown): unknown;
}

const { ids: filterOperatorIds, pairs: DataFilterOperatorPairs } = ListItems.as<DataFilterOperatorListItem>().create([
  { id: 'equals', text: 'is equal to', operatorSymbol: '=', valueModification: v => v },
  { id: 'notEquals', text: 'is not equal to', operatorSymbol: '!=', valueModification: v => v },
  { id: 'greaterThan', text: 'is greater than', operatorSymbol: '>', valueModification: v => v },
  { id: 'lessThan', text: 'is less than', operatorSymbol: '<', valueModification: v => v },
  { id: 'greaterThanOrEqualTo', text: 'is greater than or equal to', operatorSymbol: '>=', valueModification: v => v },
  { id: 'lessThanOrEqualTo', text: 'is less than or equal to', operatorSymbol: '<=', valueModification: v => v },
  { id: 'contains', text: 'contains', operatorSymbol: 'LIKE', valueModification: v => `%${v}%` },
] as const);

const DataFilterOperators = DataFilterOperatorPairs as (typeof DataFilterOperatorPairs & {
  getSymbolFor(operator: DataFilterOperator): string | undefined;
  applyValueModificationUsing(operator: DataFilterOperator, value: unknown): unknown;
});
DataFilterOperators.getSymbolFor = operator => DataFilterOperators.find(item => item.id === operator)?.operatorSymbol;
DataFilterOperators.applyValueModificationUsing = (operator, value) => DataFilterOperators.find(item => item.id === operator)?.valueModification(value) ?? value;

export type DataFilterOperator = typeof filterOperatorIds;
export { DataFilterOperators };

export interface DataFilterFull<T extends {} = {}, K extends keyof T = keyof T> {
  field: K;
  operator: DataFilterOperator;
  value: T[K];
}

export type DataFilter<T extends {} = {}> = {
  [K in keyof T]?: T[K] | { operator: DataFilterOperator; value: T[K]; };
} | DataFilterFull<T, keyof T>;

export type DataFilterGroupCondition = 'AND' | 'OR';

export interface DataFilterGroup<T extends {} = {}> {
  condition?: DataFilterGroupCondition;
  subFilters?: DataFilters<T>[];
  filters?: DataFilter<T>[];
}

export type DataFilters<T extends {}> = DataFilter<T> | DataFilter<T>[] | DataFilterGroup<T>;

export type DataSorts<T> = [keyof T, 'ASC' | 'DESC'][];

export interface DataPagination {
  offset?: number;
  limit: number;
}

export interface DataRequest<T extends {} = {}> {
  filters?: DataFilters<T>;
  sorts?: DataSorts<T>;
  pagination?: DataPagination;
}

export interface DataRequestResult<T extends {} = {}> {
  records: T[];
  totalRecordCount: number;
}