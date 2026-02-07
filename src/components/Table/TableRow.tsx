import type { Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { TableColumn } from './TableModels';
import { TableCell } from './TableCell';
import { useMemo } from 'react';
import { createStyles } from '../../theme';
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

interface Props<RecordType extends Record> {
  record?: RecordType;
  index: number;
  columns: TableColumn[];
}

export const TableRow = createComponent('TableRow', <RecordType extends Record>({
  record,
  index,
  columns,
}: Props<RecordType>) => {
  const { css } = useStyles();

  const content = useMemo(() => columns.map((column, columnIndex) => (
    <TableCell key={`${column.id}${record == null ? '' : `${record.id}`}`} column={column} columnIndex={columnIndex} record={record} rowIndex={index} />
  )), [columns, record, index]);

  const row = (
    <Flex tagName="table-row" className={css.row} disableGrow>
      {content}
    </Flex>
  );

  return record == null ? <UIState isLoading>{row}</UIState> : row;
});