import { createComponent } from '../Component';
import { useRef, useState } from 'react';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import { GridColumn, GridOnRequest } from './GridModels';
import { Record } from '@anupheaus/common';
import { GridHeader, GridHeaderActions } from './GridHeader';
import { GridFooter } from './GridFooter';
import { GridRows, GridRowsProps } from './GridRows';
import { GridColumnWidthProvider } from './GridColumnWidths';
import { UseActions, useActions, useBound, useOnUnmount } from '../../hooks';
import { UIState } from '../../providers';
import { useColumns } from './useColumns';
import { ListActions } from '../List';

export interface GridActions extends ListActions {

}

const useStyles = createStyles(({ surface: { asAContainer: { normal: container } } }) => ({
  grid: {
    display: 'flex',
    flex: 'auto',
    position: 'relative',
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'column',
    boxSizing: 'border-box',

    '& *': {
      boxSizing: 'border-box',
    },
  },
  rows: {
    flex: 'auto',
    overflow: 'hidden',
    ...container,

    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: 'inset 0 0 6px rgba(0 0 0 / 24%)',
      pointerEvents: 'none',
    },
  },
  rowScroller: {

  },
}));

interface Props<RecordType extends Record> {
  className?: string;
  records?: RecordType[];
  unitName?: string;
  columns: GridColumn<RecordType>[];
  removeLabel?: string;
  delayRenderingRows?: boolean;
  actions?: UseActions<GridActions>;
  onRequest: GridRowsProps<RecordType>['onRequest'];
  onAdd?(): void;
  onEdit?(record: RecordType): void;
  onRemove?(record: RecordType): void;
}

export const Grid = createComponent('Grid', function <RecordType extends Record>({
  className,
  columns: providedColumns,
  unitName = 'record',
  removeLabel,
  delayRenderingRows,
  actions,
  onRequest,
  onAdd,
  onEdit,
  onRemove,
}: Props<RecordType>) {
  const { css, join } = useStyles();
  const { columns } = useColumns({ providedColumns, unitName, removeLabel, onEdit, onRemove });
  const gridElementRef = useRef<HTMLDivElement | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [recordsLoading, setRecordsLoading] = useState(false);
  const { setActions, onScrollLeft } = useActions<GridHeaderActions>();
  const hasUnmounted = useOnUnmount();

  const wrapRequest = useBound<GridOnRequest<RecordType>>(async pagination => {
    setRecordsLoading(true);
    const response = await onRequest(pagination);
    if (!hasUnmounted()) {
      setTotalRecords(response.total);
      setRecordsLoading(false);
    }
    return response;
  });

  const handleScrollLeft = useBound((value: number) => onScrollLeft(value));

  return (
    <Tag
      ref={gridElementRef}
      name="grid"
      className={join(css.grid, className)}
    >
      <GridColumnWidthProvider>
        <GridHeader columns={columns} actions={setActions} />
        <GridRows columns={columns} actions={actions} onRequest={wrapRequest} onScrollLeft={handleScrollLeft} delayRendering={delayRenderingRows} />
        <UIState isLoading={recordsLoading}>
          <GridFooter totalRecords={totalRecords} unitName={unitName} onAdd={onAdd} />
        </UIState>
      </GridColumnWidthProvider>
    </Tag>
  );
});
