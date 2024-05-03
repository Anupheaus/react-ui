import { Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { GridColumn } from './GridModels';
import { GridCell } from './GridCell';
import { useMemo } from 'react';
import { createStyles } from '../../theme';
import { useListItem } from '../InternalList';
import { UIState } from '../../providers';

const useStyles = createStyles(({ field: { value: { normal: field } } }) => ({
  row: {
    borderBottomColor: field.borderColor,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    height: 'fit-content',

    '&.is-last-item': {
      borderBottomWidth: 0,
    },
  },
}));

interface Props {
  columns: GridColumn[];
}

export const GridRow = createComponent('GridRow', <RecordType extends Record>({
  columns,
}: Props) => {
  const { css } = useStyles();
  const { item: record, index, isLoading } = useListItem<RecordType>();

  const content = useMemo(() => columns.map((column, columnIndex) => (
    <GridCell key={`${column.id}${record == null ? '' : `${record.id}`}`} column={column} columnIndex={columnIndex} record={record} rowIndex={index} />
  )), [columns, record, index]);

  return (
    <Flex tagName="grid-row" className={css.row}>
      <UIState isLoading={isLoading}>
        {content}
      </UIState>
    </Flex>
  );
});