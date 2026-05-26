import { useLayoutEffect, useRef } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { TableRenderValueProps } from './TableModels';
import { TableRowEditAction } from './TableRowEditAction';
import { TableRowMenuAction } from './TableRowMenuAction';
import { createStyles } from '../../theme';
import type { ReactNode } from 'react';
import type { PromiseMaybe, Record } from '@anupheaus/common';
import { useOnResize } from '../../hooks';
import { useReportTableActionsColumnWidth } from './TableActionsColumnWidthContext';

const useStyles = createStyles(({ surface: { shadows: { light } } }) => ({
  tableRowActions: {
    height: '100%',
    width: 'max-content',
    boxSizing: 'border-box',
    padding: '4px 12px',
    position: 'relative',
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

interface Props<RecordType extends Record> extends TableRenderValueProps<RecordType> {
  children?: ReactNode;
  onEdit?(record: RecordType, index: number): PromiseMaybe<void>;
  onRemove?(record: RecordType, index: number): PromiseMaybe<void>;
  unitName?: string;
  removeLabel?: string;
}

export const TableRowActionColumn = createComponent('TableRowActionColumn', <RecordType extends Record>({
  record,
  rowIndex,
  onEdit,
  onRemove,
  unitName,
  removeLabel,
  children,
}: Props<RecordType>) => {
  const { css } = useStyles();
  const reportWidth = useReportTableActionsColumnWidth();
  const { width, target, elementRef } = useOnResize({ observeWidthOnly: true });
  const lastReportedWidthRef = useRef<number>();

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element == null || width == null) return;
    const normalizedWidth = Math.ceil(element.scrollWidth);
    if (normalizedWidth <= 0) return;
    if (lastReportedWidthRef.current === normalizedWidth) return;
    lastReportedWidthRef.current = normalizedWidth;
    reportWidth(normalizedWidth);
  }, [width, reportWidth, elementRef]);

  return (
    <Flex tagName="table-row-actions" ref={target} gap={4} align="left" valign="center" className={css.tableRowActions}>
      {children ?? <>
        {onEdit != null && <TableRowEditAction onEdit={onEdit} record={record} rowIndex={rowIndex} />}
        {onRemove != null && <TableRowMenuAction unitName={unitName ?? 'record'} removeLabel={removeLabel} onRemove={onRemove} record={record} rowIndex={rowIndex} />}
      </>}
      <Flex tagName="table-row-actions-shadow" className={css.tableActionsShadow} />
    </Flex>
  );
});
