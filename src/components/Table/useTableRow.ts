import type { Record } from '@anupheaus/common';
import { useListItem } from '../InternalList';
import { useContext } from 'react';
import { TableColumnsContext } from './TableColumnsContext';

export function useTableRow<RecordType extends string | Record>() {
  const { item: record, isLoading, index } = useListItem<RecordType>();
  const columns = useContext(TableColumnsContext);
  return { record, isLoading, index, columns };
}