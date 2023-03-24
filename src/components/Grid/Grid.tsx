import { createComponent } from '../Component';
import { CSSProperties, useMemo, useRef, useState } from 'react';
import { Tag } from '../Tag';
import { useBooleanState } from '../../hooks';
import { useUIState } from '../../providers';
import { createStyles } from '../../theme';
import { GridColumn } from './GridModels';
import { AnyObject, DataRequest, Record } from '@anupheaus/common';
import { GridContexts } from './GridContexts';
import { Scroller } from '../Scroller';
import { GridTheme } from './GridTheme';
import { GridHeaderCell } from './GridHeaderCell';
import { GridCell } from './GridCell';
import { GridActions } from './GridActions';

const loadingRecords = Array.ofSize(10).map((_, index) => ({ id: `loading-${index}` }));

interface Props {
  className?: string;
  records?: Record[];
  columns: GridColumn[];
  onRequest?(request: DataRequest): void;
}

const useStyles = createStyles(({ useTheme }) => {
  const { borders: { radius: borderRadius }, headers: { backgroundColor } } = useTheme(GridTheme);
  return {
    styles: {
      grid: {
        display: 'flex',
        flex: 'auto',
        position: 'relative',
        width: '100%',
        borderRadius,
        overflow: 'hidden',
      },
      gridHeaderBackground: {
        position: 'absolute',
        inset: 0,
        bottom: 'unset',
        backgroundColor,
        height: 'var(--header-height)',
        pointerEvents: 'none',
        zIndex: 1,
      },
      gridRender: {
        display: 'grid',
        gridTemplateColumns: 'repeat(var(--column-count), 1fr)',
      },
      gridInsetShadow: {
        position: 'absolute',
        inset: 0,
        top: 'var(--header-height)',
        boxShadow: 'inset 0 0 6px rgba(0 0 0 / 24%)',
        pointerEvents: 'none',
      },
    },
  };
});

export const Grid = createComponent('Grid', ({
  className,
  columns,
  records = Array.empty(),
  onRequest,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();
  const [isMouseOver, setMouseEntered, setMouseLeft] = useBooleanState();
  const isActionsVisible = isMouseOver && !isLoading;
  const [headerHeight, setHeaderHeight] = useState<number>();
  const gridElementRef = useRef<HTMLDivElement | null>(null);

  const visibleColumns = useMemo(() => columns.filter(({ isVisible }) => isVisible !== false), [columns]);

  const style = useMemo<CSSProperties & AnyObject>(() => ({
    '--column-count': visibleColumns.length,
    '--header-height': `${headerHeight ?? 0}px`,
  }), [visibleColumns.length, headerHeight]);

  const headerCells = useMemo(() => {
    return visibleColumns
      .filter(({ isVisible }) => isVisible !== false)
      .map((column, index) => (
        <GridHeaderCell
          key={column.id}
          column={column}
          columnIndex={index}
        />
      ));
  }, [visibleColumns]);

  const rowCells = useMemo(() => {
    const recordsToRender = isLoading ? (records.length > 0 ? records : loadingRecords) : records;
    return recordsToRender
      .map((record, rowIndex, recordsArray) => visibleColumns
        .map((column, columnIndex) => (
          <GridCell key={`${column.id}-${record.id}`} column={column} isLastRow={rowIndex === recordsArray.length - 1}>
            {column.renderValue?.({ ...column, rowIndex, columnIndex, record }) ?? null}
          </GridCell>
        ))).flatten();
  }, [visibleColumns, records]);

  return (
    <Tag
      ref={gridElementRef}
      name="grid"
      className={join(css.grid, className)}
      onMouseOver={setMouseEntered}
      onMouseEnter={setMouseEntered}
      onMouseLeave={setMouseLeft}
      onMouseOut={setMouseLeft}
      style={style}
    >
      <GridContexts.setHeaderHeight.Provider value={setHeaderHeight}>
        <Tag name="grid-header-background" className={css.gridHeaderBackground} />
        <Scroller disableShadows offsetTop={headerHeight}>
          <Tag name="grid-render" className={css.gridRender}>
            {headerCells}
            {rowCells}
          </Tag>
        </Scroller>
        <Tag name="grid-inset-shadow" className={css.gridInsetShadow} />
      </GridContexts.setHeaderHeight.Provider>
      <GridActions elementRef={gridElementRef} isVisible={isActionsVisible} />
    </Tag>
  );
});
