import { createComponent } from '../Component';
import type { ComponentProps, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import type { TableColumn, TableOnRequest, TableUseRecordHook } from './TableModels';
import type { Record } from '@anupheaus/common';
import type { TableHeaderActions } from './TableHeader';
import { TableHeader } from './TableHeader';
import { TableFooter } from './TableFooter';
import type { TableRowsProps } from './TableRows';
import { TableRows } from './TableRows';
import { TableColumnWidthProvider } from './TableColumnWidths';
import type { UseActions } from '../../hooks';
import { useActions, useBatchUpdates, useBound, useOnUnmount } from '../../hooks';
import { UIState } from '../../providers';
import { useColumns } from './useColumns';
import type { ListActions } from '../List';

export interface TableActions extends ListActions {

}

const useStyles = createStyles(({ surface: { asAContainer: { normal: container } } }) => ({
  table: {
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
type FooterProps = ComponentProps<typeof TableFooter>;
interface Props<RecordType extends Record> extends Pick<UseColumnsProps<RecordType>, 'onEdit' | 'onRemove' | 'removeLabel'>, Pick<FooterProps, 'onAdd'> {
  className?: string;
  records?: RecordType[];
  columns: TableColumn<RecordType>[];
  delayRenderingRows?: boolean;
  unitName?: string;
  children?: ReactNode;
  useRecordHook?: TableUseRecordHook<RecordType>;
  actions?: UseActions<TableActions>;
  onRequest: TableRowsProps<RecordType>['onRequest'];
}

export const Table = createComponent('Table', function <RecordType extends Record>({
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
  const tableElementRef = useRef<HTMLDivElement | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [recordsLoading, setRecordsLoading] = useState(false);
  const { setActions, onScrollLeft } = useActions<TableHeaderActions>();
  const hasUnmounted = useOnUnmount();
  const batchUpdates = useBatchUpdates();
  const [error, setError] = useState<Error>();

  const wrapRequest = useBound<TableOnRequest<RecordType | string>>(async (request, response) => {
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
      ref={tableElementRef}
      name="react-table" // called react-table instead of table to ignore errors about table-rows not being a valid descendent of table.
      className={join(css.table, className)}
    >
      <TableColumnWidthProvider>
        <TableHeader columns={columns} actions={setActions} />
        <TableRows
          columns={columns}
          actions={actions}
          onRequest={wrapRequest}
          onError={handleError}
          onScrollLeft={handleScrollLeft}
          useRecordHook={useRecordHook}
          delayRendering={delayRenderingRows}
        >
          {children}
        </TableRows>
        <UIState isLoading={recordsLoading}>
          <TableFooter totalRecords={totalRecords} unitName={unitName} error={error} onAdd={onAdd} />
        </UIState>
      </TableColumnWidthProvider>
    </Tag>
  );
});
