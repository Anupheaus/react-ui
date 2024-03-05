import { Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { GridRenderValueProps } from './GridModels';
import { GridRowEditAction } from './GridRowEditAction';
import { GridRowMenuAction } from './GridRowMenuAction';
import { createStyles } from '../../theme';
import { useSetGridColumnWidth } from './GridColumnWidths';
import { useOnResize } from '../../hooks';
import { useLayoutEffect, useRef } from 'react';

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

interface Props extends GridRenderValueProps {
  onEdit?(record: Record, rowIndex: number): void;
  onRemove?(record: Record, rowIndex: number): void;
  unitName: string;
  removeLabel?: string;
}

export const GridRowActionColumn = createComponent('GridRowActionColumn', ({
  record,
  columnIndex,
  rowIndex,
  onEdit,
  onRemove,
  unitName,
  removeLabel,
}: Props) => {
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