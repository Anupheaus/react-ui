import { createComponent } from '../Component';
import { ComponentProps, ReactNode, useRef, useState } from 'react';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import { GridColumn, GridOnRequest, GridUseRecordHook } from './GridModels';
import { Record } from '@anupheaus/common';
import { GridHeader, GridHeaderActions } from './GridHeader';
import { GridFooter } from './GridFooter';
import { GridRows, GridRowsProps } from './GridRows';
import { GridColumnWidthProvider } from './GridColumnWidths';
import { UseActions, useActions, useBatchUpdates, useBound, useOnUnmount } from '../../hooks';
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

type UseColumnsProps<RecordType extends Record> = Parameters<typeof useColumns<RecordType>>[0];
type FooterProps = ComponentProps<typeof GridFooter>;
interface Props<RecordType extends Record> extends Pick<UseColumnsProps<RecordType>, 'onEdit' | 'onRemove' | 'removeLabel'>, Pick<FooterProps, 'onAdd'> {
  className?: string;
  records?: RecordType[];
  columns: GridColumn<RecordType>[];
  delayRenderingRows?: boolean;
  unitName?: string;
  children?: ReactNode;
  useRecordHook?: GridUseRecordHook<RecordType>;
  actions?: UseActions<GridActions>;
  onRequest: GridRowsProps<RecordType>['onRequest'];
}

export const Grid = createComponent('Grid', function <RecordType extends Record>({
  className,
  columns: providedColumns,
  unitName = 'record',
  removeLabel,
  delayRenderingRows,
  children,
  useRecordHook,
  actions,
  onRequest,
  onAdd,
  onEdit,
  onRemove,
}: Props<RecordType>) {
  const { css, join } = useStyles();
  const { columns } = useColumns<RecordType>({ providedColumns, unitName, removeLabel, onEdit, onRemove });
  const gridElementRef = useRef<HTMLDivElement | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [recordsLoading, setRecordsLoading] = useState(false);
  const { setActions, onScrollLeft } = useActions<GridHeaderActions>();
  const hasUnmounted = useOnUnmount();
  const batchUpdates = useBatchUpdates();
  const [error, setError] = useState<Error>();

  const wrapRequest = useBound<GridOnRequest<RecordType | string>>(async (request, response) => {
    setRecordsLoading(totalRecords == null);
    await onRequest(request, ({ requestId, records, total }) => batchUpdates(() => {
      if (hasUnmounted()) return;
      setTotalRecords(total);
      setRecordsLoading(false);
      response({ requestId, records, total });
    }));
  });

  const handleScrollLeft = useBound((value: number) => onScrollLeft(value));

  const handleError = useBound((e: Error) => batchUpdates(() => {
    setError(e);
    setRecordsLoading(false);
    setTotalRecords(0);
  }));

  return (
    <Tag
      ref={gridElementRef}
      name="grid"
      className={join(css.grid, className)}
    >
      <GridColumnWidthProvider>
        <GridHeader columns={columns} actions={setActions} />
        <GridRows
          columns={columns}
          actions={actions}
          onRequest={wrapRequest}
          onError={handleError}
          onScrollLeft={handleScrollLeft}
          useRecordHook={useRecordHook}
          delayRendering={delayRenderingRows}
        >
          {children}
        </GridRows>
        <UIState isLoading={recordsLoading}>
          <GridFooter totalRecords={totalRecords} unitName={unitName} error={error} onAdd={onAdd} />
        </UIState>
      </GridColumnWidthProvider>
    </Tag>
  );
});
