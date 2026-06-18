import { createComponent } from '../Component';
import { useMemo, useRef, useState } from 'react';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import type { TableColumn, TableOnRequest } from './TableModels';
import type { Record } from '@anupheaus/common';
import type { TableHeaderActions } from './TableHeader';
import { TableHeader } from './TableHeader';
import type { InternalListFooterProps } from '../InternalList/InternalListFooter';
import { InternalListFooter } from '../InternalList/InternalListFooter';
import { resolveTableTheme } from './resolveTableTheme';
import type { TableRowsProps } from './TableRows';
import { TableRows } from './TableRows';
import { TableColumnWidthProvider } from './TableColumnWidths';
import { TableActionsColumnWidthProvider } from './TableActionsColumnWidthContext';
import { estimateTableActionsColumnWidth, canPersistTableColumnWidth, TABLE_ACTIONS_COLUMN_ID } from './tableConstants';
import type { UseActions } from '../../hooks';
import { useActions, useBatchUpdates, useBooleanState, useBound, useOnUnmount } from '../../hooks';
import { UIState } from '../../providers';
import { useColumns } from './useColumns';
import { useTableSettings } from './useTableSettings';
import { TableHoverContext } from './TableHoverContext';
import type { ListActions } from '../List';

export interface TableActions extends ListActions {

}

const useStyles = createStyles((theme) => {
  const { footerBackgroundColor } = resolveTableTheme(theme);
  return {
    table: {
      display: 'flex',
      flex: 'auto',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      borderRadius: 4,
      overflow: 'hidden',
      flexDirection: 'column',
      boxSizing: 'border-box',

      '& *': {
        boxSizing: 'border-box',
      },
    },
    tableFooter: {
      backgroundColor: footerBackgroundColor,
    },
  };
});

type UseColumnsProps<RecordType extends Record> = Parameters<typeof useColumns<RecordType>>[0];
interface Props<RecordType extends Record> extends Pick<UseColumnsProps<RecordType>, 'onEdit' | 'onRemove' | 'removeLabel'>, Pick<InternalListFooterProps, 'onAdd' | 'summary' | 'hideRecordCount' | 'addLabel' | 'addTooltip'> {
  className?: string;
  records?: RecordType[];
  columns: TableColumn<RecordType>[];
  delayRenderingRows?: boolean;
  unitName?: string;
  actions?: UseActions<TableActions>;
  onRequest: TableRowsProps<RecordType>['onRequest'];
  persistenceKey?: string;
}

export const Table = createComponent('Table', function <RecordType extends Record>({
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
  summary,
  hideRecordCount,
  addLabel,
  addTooltip,
  persistenceKey,
}: Props<RecordType>) {
  const { css, join } = useStyles();
  const { columns } = useColumns<RecordType>({ providedColumns, unitName, removeLabel, onEdit, onRemove });
  const { settings, persistColumnWidth } = useTableSettings(persistenceKey);
  const tableElementRef = useRef<HTMLDivElement | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [recordsLoading, setRecordsLoading] = useState(false);
  const { setActions, onScrollLeft } = useActions<TableHeaderActions>();
  const hasUnmounted = useOnUnmount();
  const batchUpdates = useBatchUpdates();
  const [error, setError] = useState<Error>();
  const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0);
  const [isHovered, handleMouseEnter, handleMouseLeave] = useBooleanState();

  const wrapRequest = useBound<TableOnRequest<RecordType>>(async (request, response) => {
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

  const initialColumnWidths = useMemo(() => {
    const savedWidths = settings?.columnWidths;
    if (savedWidths == null) return undefined;
    const widths = new Map<number, number>();
    columns.forEach((column, columnIndex) => {
      if (!canPersistTableColumnWidth(column)) return;
      const savedWidth = savedWidths[column.id];
      if (savedWidth != null) widths.set(columnIndex, savedWidth);
    });
    return widths.size > 0 ? widths : undefined;
  }, [columns, settings?.columnWidths]);

  const handleColumnWidthPersist = useBound((columnId: string, width: number) => {
    const column = columns.find(({ id }) => id === columnId);
    if (column == null) return;
    persistColumnWidth(columnId, width, column.isResizable === true);
  });

  const actionsColumnIndex = useMemo(
    () => columns.findIndex(column => column.id === TABLE_ACTIONS_COLUMN_ID),
    [columns],
  );

  const estimatedActionsColumnWidth = estimateTableActionsColumnWidth(
    (onEdit != null ? 1 : 0) + (onRemove != null ? 1 : 0),
  );

  return (
    <Tag
      ref={tableElementRef}
      name="react-table" // called react-table instead of table to ignore errors about table-rows not being a valid descendent of table.
      className={join(css.table, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TableHoverContext.Provider value={isHovered}>
        <TableColumnWidthProvider initialWidths={initialColumnWidths}>
          <TableActionsColumnWidthProvider
            columnIndex={actionsColumnIndex}
            initialWidth={actionsColumnIndex === -1 ? undefined : estimatedActionsColumnWidth}
          >
            <UIState isLoading={recordsLoading}>
              <TableHeader
                columns={columns}
                actions={setActions}
                scrollbarWidth={verticalScrollbarWidth}
                onColumnWidthPersist={persistenceKey == null ? undefined : handleColumnWidthPersist}
              />
            </UIState>
            <TableRows
              columns={columns}
              onVerticalScrollbarWidthChange={setVerticalScrollbarWidth}
              actions={actions}
              onRequest={wrapRequest}
              onError={handleError}
              onScrollLeft={handleScrollLeft}
              delayRendering={delayRenderingRows}
              isInitialLoading={totalRecords == null}
            />
            <UIState isLoading={recordsLoading}>
              <InternalListFooter
                total={totalRecords}
                unitName={unitName}
                error={error}
                summary={summary}
                hideRecordCount={hideRecordCount}
                onAdd={onAdd}
                addLabel={addLabel}
                addTooltip={addTooltip}
                footerClassName={css.tableFooter}
              />
            </UIState>
          </TableActionsColumnWidthProvider>
        </TableColumnWidthProvider>
      </TableHoverContext.Provider>
    </Tag>
  );
});
