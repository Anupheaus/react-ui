import { useLayoutEffect } from 'react';
import { createComponent } from '../../../../Component';
import { GridColumn, GridColumnSort } from '../../../GridModels';
import { GridColumnsAction } from '../../actions/GridColumnsAction';
import { useGridColumns } from './useGridColumns';

interface Props<T = unknown> {
  columns: GridColumn<T>[];
  onChange?(columns: GridColumn<T>[]): void;
  onSort?(sortedColumns: GridColumnSort<T>[]): void;
}

export const GridColumns = createComponent('GridColumns', function <T = unknown>({
  columns,
  onChange,
}: Props<T>) {
  const { upsert, remove, onChange: onModified } = useGridColumns();

  useLayoutEffect(() => {
    upsert(columns);
    return () => remove(columns);
  }, [columns]);

  onModified(newColumns => onChange?.(newColumns));

  return (<>
    {onChange && <GridColumnsAction />}
  </>);

});
