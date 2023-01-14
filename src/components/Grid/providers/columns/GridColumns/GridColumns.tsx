import { useLayoutEffect } from 'react';
import { ComponentRenderStyles, ComponentStylesConfig, ComponentStylesUtils, createComponent } from '../../../../Component';
import { GridColumn, GridColumnSort } from '../../../GridModels';
import { GridColumnsAction } from '../../actions/GridColumnsAction';
import { useGridColumns } from './useGridColumns';

interface Props<T = unknown> {
  columns: GridColumn<T>[];
  onChange?(columns: GridColumn<T>[]): void;
  onSort?(sortedColumns: GridColumnSort<T>[]): void;
}

function styles({ useTheme }: ComponentStylesUtils, _: Props) {
  return { styles: {} };
}

export const GridColumns = createComponent({
  id: 'GridColumns',

  styles,

  render<T = unknown>({
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
  },

});
