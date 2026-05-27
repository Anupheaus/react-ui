import type { Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import type { TableColumn } from './TableModels';
import { TableCell } from './TableCell';
import { useMemo } from 'react';
import { createStyles } from '../../theme';
import { UIState } from '../../providers';
import { splitTableColumns } from './splitTableColumns';

const useStyles = createStyles(({ fields: { content: { normal } } }) => ({
  row: {
    borderBottomColor: normal.borderColor,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    height: 'fit-content',
    width: '100%',
    minWidth: 'max-content',
    alignSelf: 'stretch',
  },
  rowFill: {
    flex: '1 1 auto',
    minWidth: 0,
    alignSelf: 'stretch',
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

  const { dataColumns, actionsColumn, actionsColumnIndex } = useMemo(
    () => splitTableColumns(columns),
    [columns],
  );

  const dataCells = useMemo(() => dataColumns.map((column) => {
    const columnIndex = columns.findIndex(({ id }) => id === column.id);
    return (
      <TableCell
        key={`${column.id}${record == null ? '' : `${record.id}`}`}
        column={column}
        columnIndex={columnIndex}
        record={record}
        rowIndex={index}
      />
    );
  }), [columns, dataColumns, record, index]);

  const actionsCell = actionsColumn != null && actionsColumnIndex !== -1 ? (
    <TableCell
      key={`${actionsColumn.id}${record == null ? '' : `${record.id}`}`}
      column={actionsColumn}
      columnIndex={actionsColumnIndex}
      record={record}
      rowIndex={index}
    />
  ) : null;

  const row = (
    <Flex
      tagName="table-row"
      className={css.row}
      disableGrow
      align="left"
      valign="stretch"
    >
      {dataCells}
      {actionsCell != null && (<>
        <Tag name="table-row-fill" className={css.rowFill} />
        {actionsCell}
      </>)}
    </Flex>
  );

  return record == null ? <UIState isLoading>{row}</UIState> : row;
});
