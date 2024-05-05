import { Record } from '@anupheaus/common';
import { useListItem } from '../InternalList';
import { useContext } from 'react';
import { GridColumnsContext } from './GridColumnsContext';

export function useGridRow<RecordType extends string | Record>() {
  const { item: record, isLoading, index } = useListItem<RecordType>();
  const columns = useContext(GridColumnsContext);
  return { record, isLoading, index, columns };
}