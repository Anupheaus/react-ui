import type { Record } from '@anupheaus/common';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import type { TableColumn } from './TableModels';
import { TableRowActionColumn } from './TableRowActionColumn';
import { createStyles } from '../../theme';
import Color from 'color';

const useStyles = createStyles(({ surface: { asAContainer: { normal: container } } }) => ({
  tableActionsCell: {
    display: 'inline-flex',
    position: 'sticky',
    right: 0,
    backgroundColor: Color(container.backgroundColor).opaquer(1).hex(),
    overflow: 'unset',
    height: 'auto',
    textAlign: 'center',
    alignItems: 'center',
    padding: 0,
  },
}));

interface AddActionColumnProps<RecordType extends Record> extends Pick<ComponentProps<typeof TableRowActionColumn<RecordType>>, 'onEdit' | 'onRemove' | 'unitName' | 'removeLabel'> {
  css: ReturnType<typeof useStyles>['css'];
}

function addActionColumn<RecordType extends Record>({ css, unitName, removeLabel, onEdit, onRemove }: AddActionColumnProps<RecordType>): TableColumn[] {
  if (onEdit == null && onRemove == null) return [];
  return [{
    id: 'table-actions',
    label: '',
    field: '__actions',
    alignment: 'center',
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

export function useColumns<RecordType extends Record>({
  providedColumns,
  unitName,
  removeLabel,
  onEdit,
  onRemove,
}: Props<RecordType>) {
  const { css } = useStyles();

  const columns = useMemo(() => providedColumns
    .filter(({ isVisible }) => isVisible !== false)
    .concat(...addActionColumn({ css, removeLabel, unitName, onEdit, onRemove })), [providedColumns, onEdit != null]);

  return {
    columns,
  };
}