import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { TableRenderValueProps } from './TableModels';
import { TableRowEditAction } from './TableRowEditAction';
import { TableRowMenuAction } from './TableRowMenuAction';
import { createStyles } from '../../theme';
import { useSetTableColumnWidth } from './TableColumnWidths';
import { useOnResize } from '../../hooks';
import type { ComponentProps } from 'react';
import { useLayoutEffect, useRef } from 'react';
import type { Record } from '@anupheaus/common';

const useStyles = createStyles(({ surface: { shadows: { light } } }) => ({
  tableRowActions: {
    height: '100%',
    padding: '0 8px',
    width: 'min-content',
    maxWidth: 'min-content',
  },
  tableActionsShadow: {
    position: 'absolute',
    left: -15,
    width: 15,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',

    '&::after': {
      content: '""',
      position: 'absolute',
      right: -15,
      width: 15,
      top: 0,
      bottom: 0,
      ...light,
    },
  },
}));

interface Props<RecordType extends Record> extends TableRenderValueProps<RecordType>,
  Pick<ComponentProps<typeof TableRowEditAction<RecordType>>, 'onEdit'>, Pick<ComponentProps<typeof TableRowMenuAction<RecordType>>, 'onRemove' | 'unitName' | 'removeLabel'> { }

export const TableRowActionColumn = createComponent('TableRowActionColumn', <RecordType extends Record>({
  record,
  columnIndex,
  rowIndex,
  onEdit,
  onRemove,
  unitName,
  removeLabel,
}: Props<RecordType>) => {
  const { css } = useStyles();
  const { width, target } = useOnResize({ observeWidthOnly: true });
  const setWidth = useSetTableColumnWidth(columnIndex);
  const minWidthRef = useRef<number>();

  useLayoutEffect(() => {
    if (width == null || rowIndex != 0 || (minWidthRef.current ?? 0) >= width) return;
    minWidthRef.current = width;
    setWidth(width);
  }, [width, rowIndex]);

  return (
    <Flex tagName="table-row-actions" ref={target} gap={4} alignCentrally className={css.tableRowActions}>
      {onEdit != null && <TableRowEditAction onEdit={onEdit} record={record} rowIndex={rowIndex} />}
      {onRemove != null && <TableRowMenuAction unitName={unitName} removeLabel={removeLabel} onRemove={onRemove} record={record} rowIndex={rowIndex} />}
      <Flex tagName="table-row-actions-shadow" className={css.tableActionsShadow} />
    </Flex>
  );
});