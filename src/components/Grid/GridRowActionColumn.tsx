import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { GridRenderValueProps } from './GridModels';
import { GridRowEditAction } from './GridRowEditAction';
import { GridRowMenuAction } from './GridRowMenuAction';
import { createStyles } from '../../theme';
import { useSetGridColumnWidth } from './GridColumnWidths';
import { useOnResize } from '../../hooks';
import { ComponentProps, useLayoutEffect, useRef } from 'react';
import { Record } from '@anupheaus/common';

const useStyles = createStyles(({ surface: { shadows: { light } } }) => ({
  gridRowActions: {
    height: '100%',
    padding: '0 8px',
    width: 'min-content',
    maxWidth: 'min-content',
  },
  gridActionsShadow: {
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

interface Props<RecordType extends Record> extends GridRenderValueProps<RecordType>,
  Pick<ComponentProps<typeof GridRowEditAction<RecordType>>, 'onEdit'>, Pick<ComponentProps<typeof GridRowMenuAction<RecordType>>, 'onRemove' | 'unitName' | 'removeLabel'> { }

export const GridRowActionColumn = createComponent('GridRowActionColumn', <RecordType extends Record>({
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
  const setWidth = useSetGridColumnWidth(columnIndex);
  const minWidthRef = useRef<number>();

  useLayoutEffect(() => {
    if (width == null || rowIndex != 0 || (minWidthRef.current ?? 0) >= width) return;
    minWidthRef.current = width;
    setWidth(width);
  }, [width, rowIndex]);

  return (
    <Flex tagName="grid-row-actions" ref={target} gap={4} alignCentrally className={css.gridRowActions}>
      {onEdit != null && <GridRowEditAction onEdit={onEdit} record={record} rowIndex={rowIndex} />}
      {onRemove != null && <GridRowMenuAction unitName={unitName} removeLabel={removeLabel} onRemove={onRemove} record={record} rowIndex={rowIndex} />}
      <Flex tagName="grid-row-actions-shadow" className={css.gridActionsShadow} />
    </Flex>
  );
});