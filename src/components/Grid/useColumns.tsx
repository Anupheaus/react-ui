import { Record } from '@anupheaus/common';
import { useMemo } from 'react';
import { GridColumn } from './GridModels';
import { GridRowActionColumn } from './GridRowActionColumn';
import { createStyles } from '../../theme';
import Color from 'color';

const useStyles = createStyles(({ surface: { asAContainer: { normal: container } } }) => ({
  gridActionsCell: {
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

interface AddActionColumnProps {
  css: ReturnType<typeof useStyles>['css'];
  unitName: string;
  removeLabel?: string;
  onEdit?(record: Record): void;
  onRemove?(record: Record): void;
}

function addActionColumn({ css, unitName, removeLabel, onEdit, onRemove }: AddActionColumnProps): GridColumn[] {
  if (onEdit == null && onRemove == null) return [];
  return [{
    id: 'grid-actions',
    label: '',
    field: '__actions',
    alignment: 'center',
    isVisible: true,
    className: css.gridActionsCell,
    renderValue: props => (
      <GridRowActionColumn
        {...props}
        unitName={unitName}
        removeLabel={removeLabel}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ),
  }];
}

interface Props<RecordType extends Record> {
  providedColumns: GridColumn<RecordType>[];
  unitName: string;
  removeLabel?: string;
  onEdit?(record: Record): void;
  onRemove?(record: Record): void;
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