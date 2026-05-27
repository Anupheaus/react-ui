import type { Record } from '@anupheaus/common';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import type { TableColumn } from './TableModels';
import { TableRowActionColumn } from './TableRowActionColumn';
import { createStyles } from '../../theme';
import { resolveOpaqueTableBackground, resolveTableTheme } from './resolveTableTheme';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';

const mergeClassNames = (...classNames: (string | undefined)[]) => classNames.filter(Boolean).join(' ');

const useStyles = createStyles((theme) => {
  const { rowBackgroundColor } = resolveTableTheme(theme);
  const surfaceBackgroundColor = theme.surface.asAContainer.normal.backgroundColor ?? '#ffffff';

  return {
    tableActionsCell: {
      display: 'block',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      backgroundColor: resolveOpaqueTableBackground(rowBackgroundColor, surfaceBackgroundColor),
      overflow: 'unset',
      textAlign: 'left',
      padding: 0,
    },
  };
});

interface AddActionColumnProps<RecordType extends Record> extends Pick<ComponentProps<typeof TableRowActionColumn<RecordType>>, 'onEdit' | 'onRemove' | 'unitName' | 'removeLabel'> {
  css: ReturnType<typeof useStyles>['css'];
}

function addActionColumn<RecordType extends Record>({ css, unitName, removeLabel, onEdit, onRemove }: AddActionColumnProps<RecordType>): TableColumn[] {
  if (onEdit == null && onRemove == null) return [];
  return [{
    id: 'table-actions',
    label: '',
    field: '__actions',
    alignment: 'left',
    isVisible: true,
    className: css.tableActionsCell,
    renderValue: props => (
      <TableRowActionColumn
        {...props}
        unitName={unitName}
        removeLabel={removeLabel}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ),
  }];
}

interface Props<RecordType extends Record> extends Omit<AddActionColumnProps<RecordType>, 'css'> {
  providedColumns: TableColumn<RecordType>[];
}

function withTableActionsColumnStyles<RecordType extends Record>(
  columns: TableColumn<RecordType>[],
  tableActionsCellClassName: string,
): TableColumn<RecordType>[] {
  return columns.map(column => column.id === TABLE_ACTIONS_COLUMN_ID
    ? { ...column, alignment: 'left', className: mergeClassNames(column.className, tableActionsCellClassName) }
    : column);
}

export function useColumns<RecordType extends Record>({
  providedColumns,
  unitName,
  removeLabel,
  onEdit,
  onRemove,
}: Props<RecordType>) {
  const { css } = useStyles();

  const columns = useMemo(() => {
    const visibleColumns = providedColumns.filter(({ isVisible }) => isVisible !== false);
    const enhancedColumns = withTableActionsColumnStyles(visibleColumns, css.tableActionsCell);
    const hasActionsColumn = visibleColumns.some(column => column.id === TABLE_ACTIONS_COLUMN_ID);
    if (hasActionsColumn) return enhancedColumns;
    return enhancedColumns.concat(...addActionColumn({ css, removeLabel, unitName, onEdit, onRemove }));
  }, [providedColumns, css.tableActionsCell, removeLabel, unitName, onEdit, onRemove]);

  return {
    columns,
  };
}
